import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

const WINDOW_HOURS = 1;
const MAX_SUBMISSIONS = 5;

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_RATE_LIMIT_KEY;
  if (!url || !key) throw new Error('Missing Supabase rate limit env vars.');
  return createClient(url, key);
}

export async function getIp(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? h.get('x-real-ip')
    ?? 'unknown';
}

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean }> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from('rate_limits')
    .select('count, window_start')
    .eq('ip', ip)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found — not a real error
    console.error('Rate limit check error:', error.message);
    return { allowed: true }; // fail open so a DB hiccup doesn't break submissions
  }

  const now = new Date();

  if (!data) {
    await supabase.from('rate_limits').insert({ ip, count: 1, window_start: now });
    return { allowed: true };
  }

  const windowExpired =
    now.getTime() - new Date(data.window_start).getTime() > WINDOW_HOURS * 60 * 60 * 1000;

  if (windowExpired) {
    await supabase.from('rate_limits').update({ count: 1, window_start: now }).eq('ip', ip);
    return { allowed: true };
  }

  if (data.count >= MAX_SUBMISSIONS) {
    return { allowed: false };
  }

  await supabase.from('rate_limits').update({ count: data.count + 1 }).eq('ip', ip);
  return { allowed: true };
}
