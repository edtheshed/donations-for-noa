'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Donation } from '@/types/donation';
import { DonationCard } from './DonationCard';

const CARD_WIDTH = 288;
const CARD_GAP = 20;
const SPEED = 60;
const RESUME_DELAY = 5000;
const ARROW_SCROLL = CARD_WIDTH + CARD_GAP;
const ARROW_DECAY = 9; // ease-out decay constant (higher = snappier start, quicker finish)

function ArrowButton({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onClick}
      aria-label={direction === 'left' ? 'Scroll left' : 'Scroll right'}
      className={[
        'absolute top-1/2 -translate-y-1/2 z-20',
        'w-9 h-9 rounded-full flex items-center justify-center',
        'bg-white border border-warm-border shadow-sm',
        'text-warm-muted hover:text-ocean hover:border-ocean',
        'transition-all duration-150 cursor-pointer',
        direction === 'left' ? 'left-2' : 'right-2',
        pressed ? 'scale-90' : 'scale-100',
      ].join(' ')}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {direction === 'left'
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );
}

export function DonationMarquee({ donations }: { donations: Donation[] }) {
  const repeat = Math.max(2, Math.ceil(2400 / (donations.length * (CARD_WIDTH + CARD_GAP))) + 1);

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const loopAtRef = useRef(0);

  // drag state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // Arrow smooth scroll
  const arrowDeltaRef = useRef(0);
  const arrowLastTimeRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const midItem = el.children[repeat * donations.length] as HTMLElement | undefined;
    loopAtRef.current = midItem ? midItem.offsetLeft : Math.round(el.scrollWidth / 2);

    function onScroll() {
      if (!el) return;
      if (el.scrollLeft >= loopAtRef.current) el.scrollLeft -= loopAtRef.current;
      else if (el.scrollLeft < 0) el.scrollLeft += loopAtRef.current;
    }

    function tick(time: number) {
      if (!el) return;

      if (arrowDeltaRef.current !== 0) {
        const dt = arrowLastTimeRef.current > 0 ? (time - arrowLastTimeRef.current) / 1000 : 0;
        arrowLastTimeRef.current = time;
        if (dt > 0) {
          // Exponential decay: step = remaining × (1 - e^(-k·dt))
          // Starts fast, tapers to zero — frame-rate independent
          const step = arrowDeltaRef.current * (1 - Math.exp(-ARROW_DECAY * dt));
          el.scrollLeft += step;
          arrowDeltaRef.current -= step;
          if (Math.abs(arrowDeltaRef.current) < 0.5) arrowDeltaRef.current = 0;
        }
        lastTimeRef.current = 0;
      } else {
        arrowLastTimeRef.current = 0;
        if (!pausedRef.current) {
          if (lastTimeRef.current > 0) {
            el.scrollLeft += SPEED * (time - lastTimeRef.current) / 1000;
          }
          lastTimeRef.current = time;
        } else {
          lastTimeRef.current = 0;
        }
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

  const modalOpenRef = useRef(false);

  const pauseTemporarily = useCallback(() => {
    pausedRef.current = true;
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      if (!modalOpenRef.current) pausedRef.current = false;
    }, RESUME_DELAY);
  }, []);

  const handleModalChange = useCallback((open: boolean) => {
    modalOpenRef.current = open;
    if (open) {
      pausedRef.current = true;
      clearTimeout(resumeTimerRef.current);
    } else {
      pauseTemporarily();
    }
  }, [pauseTemporarily]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    pauseTemporarily();
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragScrollLeftRef.current = el.scrollLeft;
    setIsDragging(true);
  }, [pauseTemporarily]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    e.preventDefault();
    const dx = e.clientX - dragStartXRef.current;
    el.scrollLeft = dragScrollLeftRef.current - dx;
    pauseTemporarily();
  }, [pauseTemporarily]);

  const stopDrag = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  const scrollBy = useCallback((delta: number) => {
    pauseTemporarily();
    arrowDeltaRef.current += delta;
  }, [pauseTemporarily]);

  const items = Array.from({ length: repeat * 2 * donations.length }, (_, i) => donations[i % donations.length]);

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" />

      <ArrowButton direction="left" onClick={() => scrollBy(-ARROW_SCROLL)} />
      <ArrowButton direction="right" onClick={() => scrollBy(ARROW_SCROLL)} />

      <div
        ref={containerRef}
        className="flex overflow-x-auto select-none"
        style={{
          scrollbarWidth: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onWheel={pauseTemporarily}
        onTouchStart={pauseTemporarily}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {items.map((donation, i) => (
          <div key={i} className="flex-shrink-0 w-72 pr-5">
            <DonationCard donation={donation} index={0} onModalChange={handleModalChange} />
          </div>
        ))}
      </div>
    </div>
  );
}
