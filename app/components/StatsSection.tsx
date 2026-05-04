import { Donation } from '@/types/donation';

function BloodDrop({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5C9.5 7 5.5 11.5 5.5 15.5a6.5 6.5 0 0013 0c0-4-4-8.5-6.5-13z" />
    </svg>
  );
}

export function StatsSection({ donations }: { donations: Donation[] }) {
  const count = donations.length;

  return (
    <section className="max-w-3xl mx-auto px-6 py-14 text-center">
      <p
        className="text-warm-ink mb-10"
        style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 600, lineHeight: 1.2 }}
      >
        {count === 0
          ? 'No donations recorded yet.'
          : `${count} donations recorded.`}
      </p>

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
