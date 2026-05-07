'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { Donation } from '@/types/donation';

function CalendarIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function BloodDrop() {
  return (
    <svg viewBox="0 0 64 80" className="w-16 h-20 opacity-20" fill="var(--color-crimson)" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 4 C32 4, 8 34, 8 50 C8 64.4 18.8 76 32 76 C45.2 76 56 64.4 56 50 C56 34 32 4 32 4Z" />
    </svg>
  );
}

function CardPhoto({ donation, large = false }: { donation: Donation; large?: boolean }) {
  const h = large ? 'h-64' : 'h-44';
  return donation.photo_url ? (
    <div className={`relative w-full ${h} overflow-hidden`}>
      <Image
        src={donation.photo_url}
        alt={`Photo from ${donation.name}`}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ocean-mid opacity-40" />
    </div>
  ) : (
    <div className={`relative w-full ${h} overflow-hidden bg-ocean-light flex items-center justify-center`}>
      <BloodDrop />
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ocean-mid opacity-40" />
    </div>
  );
}

interface Props {
  donation: Donation;
  index: number;
  onModalChange?: (open: boolean) => void;
}

export function DonationCard({ donation, index, onModalChange }: Props) {
  const [open, setOpen] = useState(false);
  const stagger = `stagger-${Math.min(index + 1, 4)}`;
  const hasMessage = !!donation.message;
  const pointerDown = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    onModalChange?.(open);
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onModalChange]);

  return (
    <>
      <article
        onPointerDown={e => { pointerDown.current = { x: e.clientX, y: e.clientY }; }}
        onClick={e => {
          if (!hasMessage) return;
          const p = pointerDown.current;
          if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 5) return;
          setOpen(true);
        }}
        className={[
          `animate-fade-up ${stagger}`,
          'bg-white rounded-2xl overflow-hidden shadow-sm border border-warm-border',
          'hover:shadow-md transition-shadow duration-300 flex flex-col',
          hasMessage ? 'cursor-pointer' : '',
        ].join(' ')}
      >
        <CardPhoto donation={donation} />

        <div className="p-5 flex flex-col gap-3 flex-1">
          <h3
            className="text-warm-ink leading-tight"
            style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.45rem', fontWeight: 600 }}
          >
            {donation.name}
          </h3>

          <div className="flex flex-col gap-1.5 text-sm text-warm-muted">
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <span>{formatDate(donation.donated_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <PinIcon />
              <span className="line-clamp-1">{donation.location}</span>
            </div>
          </div>

          {donation.message && (
            <blockquote
              className="text-warm-muted text-sm leading-relaxed italic border-l-2 border-ocean-mid pl-3 mt-1 line-clamp-3"
              style={{ fontFamily: 'var(--font-lora)' }}
            >
              &ldquo;{donation.message}&rdquo;
            </blockquote>
          )}

          {hasMessage && (
            <span className="text-xs text-warm-muted/60 mt-auto pt-1">Tap to read more</span>
          )}
        </div>
      </article>

      {open && (
        <div
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(26,5,5,0.6)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="animate-modal-in bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <CardPhoto donation={donation} large />

            <div className="p-6 flex flex-col gap-3">
              <h3
                className="text-warm-ink leading-tight"
                style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.7rem', fontWeight: 600 }}
              >
                {donation.name}
              </h3>

              <div className="flex flex-col gap-1.5 text-sm text-warm-muted">
                <div className="flex items-center gap-2">
                  <CalendarIcon />
                  <span>{formatDate(donation.donated_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PinIcon />
                  <span>{donation.location}</span>
                </div>
              </div>

              <blockquote
                className="text-warm-muted text-sm leading-relaxed italic border-l-2 border-ocean-mid pl-3 mt-1"
                style={{ fontFamily: 'var(--font-lora)' }}
              >
                &ldquo;{donation.message}&rdquo;
              </blockquote>

              <button
                onClick={() => setOpen(false)}
                className="mt-2 text-xs text-warm-muted/60 hover:text-warm-muted transition-colors cursor-pointer self-end"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
