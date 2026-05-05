'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { Donation } from '@/types/donation';
import { DonationCard } from './DonationCard';

const CARD_WIDTH = 288;
const CARD_GAP = 20;
const SPEED = 60;         // px/s
const RESUME_DELAY = 2000; // ms after user interaction before auto-scroll resumes

export function DonationMarquee({ donations }: { donations: Donation[] }) {
  const repeat = Math.max(2, Math.ceil(2400 / (donations.length * (CARD_WIDTH + CARD_GAP))) + 1);

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // offsetLeft of the first item in the second half = exact pixel width of one set.
    const midItem = el.children[repeat * donations.length] as HTMLElement | undefined;
    const loopAt = midItem ? midItem.offsetLeft : Math.round(el.scrollWidth / 2);

    function onScroll() {
      if (!el) return;
      if (el.scrollLeft >= loopAt) el.scrollLeft -= loopAt;
    }

    function tick(time: number) {
      if (!el) return;
      if (!pausedRef.current) {
        if (lastTimeRef.current > 0) {
          el.scrollLeft += SPEED * (time - lastTimeRef.current) / 1000;
        }
        lastTimeRef.current = time;
      } else {
        lastTimeRef.current = 0;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    el.addEventListener('scroll', onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resumeTimerRef.current);
    };
  }, [repeat, donations.length]);

  const pauseTemporarily = useCallback(() => {
    pausedRef.current = true;
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => { pausedRef.current = false; }, RESUME_DELAY);
  }, []);

  const items = Array.from({ length: repeat * 2 * donations.length }, (_, i) => donations[i % donations.length]);

  return (
    <div className="relative mb-14">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" />

      <div
        ref={containerRef}
        className="flex overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
        onWheel={pauseTemporarily}
        onTouchStart={pauseTemporarily}
        onMouseDown={pauseTemporarily}
      >
        {items.map((donation, i) => (
          <div key={i} className="flex-shrink-0 w-72 pr-5">
            <DonationCard donation={donation} index={0} />
          </div>
        ))}
      </div>
    </div>
  );
}
