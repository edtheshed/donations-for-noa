'use server';

import { revalidatePath } from 'next/cache';
import { getSupabase } from '@/lib/supabase';
import { checkRateLimit, getIp } from '@/lib/rate-limit';
import type { Donation } from '@/types/donation';

export async function getDonations(): Promise<Donation[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .order('donated_at', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getDonations error:', error.message);
    return [];
  }

  return data ?? [];
}

export async function submitDonation(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();

  if (formData.get('website')) return { success: true };

  const ip = await getIp();
  const { allowed } = await checkRateLimit(ip);
  if (!allowed) {
    return { success: false, error: 'Too many submissions. Please try again in an hour.' };
  }

  const name = (formData.get('name') as string)?.trim();
  const donated_at = formData.get('donated_at') as string;
  const location = (formData.get('location') as string)?.trim();
  const message = (formData.get('message') as string)?.trim() || null;
  const photo = formData.get('photo') as File | null;

  if (!name || !donated_at || !location) {
    return { success: false, error: 'Name, date, and location are required.' };
  }

  if (name.length > 100) return { success: false, error: 'Name must be 100 characters or fewer.' };
  if (location.length > 200) return { success: false, error: 'Location must be 200 characters or fewer.' };
  if (message && message.length > 1000) return { success: false, error: 'Message must be 1000 characters or fewer.' };

  let photo_url: string | null = null;

  if (photo && photo.size > 0) {
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED_TYPES.includes(photo.type)) {
      return { success: false, error: 'Photo must be a JPEG, PNG, or WebP image.' };
    }
    if (photo.size > 5 * 1024 * 1024) {
      return { success: false, error: 'Photo must be under 5 MB.' };
    }

    const ext = photo.type === 'image/png' ? 'png' : photo.type === 'image/webp' ? 'webp' : 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bytes = await photo.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from('donation-photos')
      .upload(fileName, bytes, { contentType: photo.type });

    if (uploadError) {
      return { success: false, error: `Photo upload failed: ${uploadError.message}` };
    }

    const { data: urlData } = supabase.storage
      .from('donation-photos')
      .getPublicUrl(fileName);

    photo_url = urlData.publicUrl;
  }

  const { error } = await supabase.from('donations').insert({
    name,
    donated_at,
    location,
    message,
    photo_url,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}
