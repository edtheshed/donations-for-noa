export const dynamic = 'force-dynamic';

import { getDonations } from '@/app/actions';
import { getJustGivingTotal } from '@/lib/justgiving';
import { DonationCard } from '@/app/components/DonationCard';
import { DonationForm } from '@/app/components/DonationForm';
import { StatsSection } from '@/app/components/StatsSection';
import { AboutSection } from '@/app/components/AboutSection';
import { FAQSection } from '@/app/components/FAQSection';
import { FinancialSupportSection } from '@/app/components/FinancialSupportSection';

function Divider() {
  return <div className="h-px bg-warm-border my-2" />;
}

export default async function Home() {
  const [donations, justGiving] = await Promise.all([
    getDonations(),
    getJustGivingTotal(),
  ]);

  return (
    <div className="min-h-screen bg-cream">

      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-cream/90 backdrop-blur-sm border-b border-warm-border">
        <nav className="overflow-x-auto whitespace-nowrap px-6 py-4 flex justify-center gap-6">
          {[
            { href: '#about', label: 'About' },
            { href: '#record', label: 'Record a donation' },
            { href: '#donations', label: 'Donations so far' },
            { href: '#financial-support', label: 'Support financially' },
            { href: '#faq', label: 'FAQ' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-warm-muted hover:text-crimson transition-colors duration-150"
              style={{ fontFamily: 'var(--font-lora)', fontSize: '0.75rem' }}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <div className="max-w-5xl mx-auto px-6">
        {/* (i) Stats + title hero */}
        <StatsSection donations={donations} justGiving={justGiving} />

        <Divider />

        {/* (ii) About */}
        <AboutSection />

        <Divider />

        {/* (iii) Donation form */}
        <section id="record" className="max-w-md mx-auto py-14">
          <h2
            className="text-warm-ink text-center mb-8"
            style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 600 }}
          >
            Record your donation
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-warm-border p-7">
            <DonationForm />
          </div>
        </section>

        <Divider />

        {/* (iv) Full donation list */}
        <section id="donations" className="py-14">
          <h2
            className="text-warm-ink text-center mb-10"
            style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 600 }}
          >
            Donations so far
          </h2>

          {donations.length === 0 ? (
            <div className="text-center py-16 text-warm-muted">
              <p style={{ fontFamily: 'var(--font-lora)' }}>
                No donations recorded yet. 
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
              {donations.map((donation, i) => (
                <DonationCard key={donation.id} donation={donation} index={i} />
              ))}
            </div>
          )}
        </section>

        <Divider />

        {/* (v) Financial support */}
        <FinancialSupportSection />

        <Divider />

        {/* (vi) FAQ */}
        <FAQSection />
      </div>

      {/* Footer */}
      <footer className="border-t border-warm-border py-7">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-center text-warm-muted text-sm">
          <span style={{ fontFamily: 'var(--font-lora)' }}>Donations for Noa</span>
        </div>
      </footer>
    </div>
  );
}
