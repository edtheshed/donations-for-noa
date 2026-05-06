'use client';

import { useState } from 'react';

const links = [
  { href: '#about', label: 'About' },
  { href: '#record', label: 'Record a donation' },
  { href: '#donations', label: 'Donations so far' },
  { href: '#good-cause', label: 'Support a good cause' },
  { href: '#faq', label: 'FAQ' },
];

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-cream/90 backdrop-blur-sm border-b border-warm-border">
      {/* Desktop */}
      <nav className="hidden sm:flex justify-center gap-6 px-6 py-4">
        {links.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="text-warm-muted hover:text-ocean transition-colors duration-150"
            style={{ fontFamily: 'var(--font-lora)', fontSize: '0.75rem' }}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Mobile */}
      <div className="sm:hidden flex items-center justify-between px-5 py-3">
        <span style={{ fontFamily: 'var(--font-lora)', fontSize: '0.85rem' }} className="text-warm-ink font-medium">
          Donations for Noa
        </span>
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="p-2 rounded-lg text-warm-muted hover:text-ocean transition-colors duration-150"
        >
          {open ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <nav className="sm:hidden border-t border-warm-border bg-cream/95 px-5 py-3 flex flex-col gap-1">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-warm-muted hover:text-ocean py-2.5 transition-colors duration-150"
              style={{ fontFamily: 'var(--font-lora)', fontSize: '0.9rem' }}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
