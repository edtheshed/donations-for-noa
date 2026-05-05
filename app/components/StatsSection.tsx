import { Donation } from '@/types/donation';

function BloodDrop({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5C9.5 7 5.5 11.5 5.5 15.5a6.5 6.5 0 0013 0c0-4-4-8.5-6.5-13z" />
    </svg>
  );
}

const DONATIONS_PER_OPERATION = 18;

function formatEquivalence(count: number): string {
  const raw = count / DONATIONS_PER_OPERATION;
  const rounded = Math.round(raw * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function StatsSection({ donations }: { donations: Donation[] }) {
  const count = donations.length;
  const equivalence = formatEquivalence(count);

  return (
    <section className="max-w-3xl mx-auto px-6 py-14 text-center">
      <h1
        className="text-warm-ink mb-6"
        style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2.8rem, 7vw, 4.5rem)', fontWeight: 600, lineHeight: 1.1 }}
      >
        Donations for Noa
      </h1>
      <p
        className="text-warm-ink mb-3"
        style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 600, lineHeight: 1.2 }}
      >
        {count === 0
          ? 'No donations recorded yet'
          : `${count} donations recorded`}
      </p>

      {count > 0 && (
        <p
          className="text-warm-muted mb-4"
          style={{ fontFamily: 'var(--font-lora)', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}
        >
          Enough blood for {equivalence} {Number(equivalence) === 1 ? 'operation ' : 'operations '} like Mad&rsquo;s
        </p>
      )}

      {count > 0 && (
        <div className="flex flex-wrap justify-center gap-2" aria-label={`${count} donations`}>
          {donations.map((d) => (
            <BloodDrop key={d.id} className="w-5 h-5 text-crimson opacity-60" />
          ))}
        </div>
      )}
    </section>
  );
}
