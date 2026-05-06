'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { submitDonation } from '@/app/actions';

function BloodDrop({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5C9.5 7 5.5 11.5 5.5 15.5a6.5 6.5 0 0013 0c0-4-4-8.5-6.5-13z" />
    </svg>
  );
}

const CARD_ASPECT = 3 / 2;
const MAX_PX = 1200;
const QUALITY = 0.8;

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-warm-border bg-white text-warm-ink placeholder-warm-muted/60 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean transition-colors duration-200';

const labelClass = 'block text-sm font-medium text-warm-ink mb-1.5';

function getCroppedBlob(img: HTMLImageElement, crop: PixelCrop): Promise<Blob | null> {
  const scaleX = img.naturalWidth / img.width;
  const scaleY = img.naturalHeight / img.height;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(crop.width * scaleX);
  canvas.height = Math.round(crop.height * scaleY);
  canvas.getContext('2d')!.drawImage(
    img,
    crop.x * scaleX, crop.y * scaleY,
    crop.width * scaleX, crop.height * scaleY,
    0, 0, canvas.width, canvas.height,
  );
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', QUALITY));
}

function compressBlob(blob: Blob): Promise<File> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_PX / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (b) => resolve(b ? new File([b], 'photo.jpg', { type: 'image/jpeg' }) : new File([blob], 'photo.jpg', { type: 'image/jpeg' })),
        'image/jpeg',
        QUALITY,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(new File([blob], 'photo.jpg', { type: 'image/jpeg' })); };
    img.src = url;
  });
}

export function DonationForm() {
  const [today, setToday] = useState('');
  useEffect(() => { setToday(new Date().toISOString().split('T')[0]); }, []);

  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Raw file for crop UI
  const [rawUrl, setRawUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  // Confirmed photo
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerCrop(makeAspectCrop({ unit: '%', width: 90 }, CARD_ASPECT, width, height), width, height));
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (rawUrl) URL.revokeObjectURL(rawUrl);
    setRawUrl(URL.createObjectURL(file));
    setCrop(undefined);
    setCompletedCrop(undefined);
  }

  const confirmCrop = useCallback(async () => {
    const img = imgRef.current;
    if (!img || !completedCrop) return;
    const blob = await getCroppedBlob(img, completedCrop);
    if (!blob) return;
    const compressed = await compressBlob(blob);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(compressed);
    setPhotoPreview(URL.createObjectURL(compressed));
    setRawUrl(null);
  }, [completedCrop, photoPreview]);

  function removePhoto() {
    if (rawUrl) URL.revokeObjectURL(rawUrl);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setRawUrl(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    const formData = new FormData(e.currentTarget);
    if (photoFile) formData.set('photo', photoFile);
    const res = await submitDonation(formData);
    setResult(res);
    setSubmitting(false);
    if (res.success) {
      formRef.current?.reset();
      removePhoto();
      setMessage('');
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" suppressHydrationWarning>
      <input
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
      />

      {/* Name */}
      <div>
        <label htmlFor="name" className={labelClass}>
          Your name <span className="text-ocean">*</span>
        </label>
        <input id="name" name="name" type="text" required maxLength={100}
          placeholder="e.g. Sarah Mitchell" className={inputClass} suppressHydrationWarning />
      </div>

      {/* Date */}
      <div>
        <label htmlFor="donated_at" className={labelClass}>
          Date donated <span className="text-ocean">*</span>
        </label>
        <input id="donated_at" name="donated_at" type="date" required max={today}
          className={inputClass} suppressHydrationWarning />
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className={labelClass}>
          Donation centre / location <span className="text-ocean">*</span>
        </label>
        <input id="location" name="location" type="text" required maxLength={200}
          placeholder="e.g. King's College Hospital, London" className={inputClass} suppressHydrationWarning />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClass}>
          A message <span className="text-warm-muted font-normal">(optional)</span>
        </label>
        <textarea id="message" name="message" rows={3} maxLength={1000}
          placeholder="Share why you donated, or anything you'd like to say..."
          className={`${inputClass} resize-none leading-relaxed`}
          value={message} onChange={(e) => setMessage(e.target.value)} suppressHydrationWarning />
        <p className={`mt-1.5 text-xs text-right ${message.length > 900 ? 'text-crimson' : 'text-warm-muted'}`}>
          {message.length}/1000
        </p>
      </div>

      {/* Photo */}
      <div>
        <label className={labelClass}>
          Photo <span className="text-warm-muted font-normal">(optional)</span>
        </label>

        {/* State 1: no photo selected */}
        {!rawUrl && !photoPreview && (
          <label htmlFor="photo-input"
            className="w-full py-7 rounded-xl border-2 border-dashed border-warm-border hover:border-ocean/40 hover:bg-ocean-light/40 transition-colors duration-200 flex flex-col items-center gap-2 text-warm-muted cursor-pointer">
            <svg className="w-7 h-7 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            <span className="text-sm">Tap to upload a photo</span>
            <span className="text-xs opacity-60">JPG, PNG, WebP · max 10 MB</span>
          </label>
        )}

        {/* State 2: crop UI */}
        {rawUrl && !photoPreview && (
          <div className="space-y-3">
            <p className="text-sm text-warm-muted" style={{ fontFamily: 'var(--font-lora)' }}>
              Drag to choose what to show on your card.
            </p>
            <div style={{ maxHeight: '70vh', overflowY: 'auto' }} className="rounded-xl overflow-hidden">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={CARD_ASPECT}
                className="w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img ref={imgRef} src={rawUrl} alt="Crop preview" onLoad={onImageLoad}
                  style={{ display: 'block', width: '100%' }} />
              </ReactCrop>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={confirmCrop} disabled={!completedCrop}
                className="flex-1 py-2.5 rounded-xl bg-warm-ink hover:bg-warm-ink/80 text-white text-sm font-medium transition-colors duration-200 disabled:opacity-40">
                Use this crop
              </button>
              <button type="button" onClick={removePhoto}
                className="px-4 py-2.5 rounded-xl border border-warm-border text-warm-muted hover:text-warm-ink text-sm transition-colors duration-200">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* State 3: confirmed preview */}
        {photoPreview && (
          <div className="relative rounded-xl overflow-hidden border border-warm-border">
              <div className="relative w-full" style={{ aspectRatio: '3/2' }}>
                <Image src={photoPreview} alt="Photo preview" fill className="object-cover" />
              </div>
              <button type="button" onClick={removePhoto}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                aria-label="Remove photo">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
          </div>
        )}

        <input ref={fileInputRef} id="photo-input" type="file" name="photo"
          accept="image/*" className="hidden" onChange={handlePhotoChange} />
      </div>

      {/* Result banner */}
      {result && (
        <div className={`rounded-xl px-4 py-3 text-sm ${
          result.success
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-crimson-light text-crimson border border-crimson/20'
        }`}>
          {result.success
            ? 'Thank you — your donation has been recorded.'
            : (result.error ?? 'Something went wrong. Please try again.')}
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={submitting}
        className="w-full py-3.5 rounded-xl bg-warm-ink hover:bg-warm-ink/80 text-white text-sm font-medium tracking-wide transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5">
        {submitting ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="45" />
            </svg>
            Recording…
          </>
        ) : (
          <>
            <BloodDrop className="w-4 h-4" />
            Record my donation
          </>
        )}
      </button>
    </form>
  );
}
