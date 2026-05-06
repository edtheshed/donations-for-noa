export const dynamic = 'force-dynamic';

import { getDonations } from '@/app/actions';
import { getJustGivingTotal } from '@/lib/justgiving';
import { DonationMarquee } from '@/app/components/DonationMarquee';
import { DonationCard } from '@/app/components/DonationCard';
import { DonationForm } from '@/app/components/DonationForm';
import { StatsSection } from '@/app/components/StatsSection';
import { AboutSection } from '@/app/components/AboutSection';
import { FAQSection } from '@/app/components/FAQSection';
import { GoodCauseSection } from '@/app/components/GoodCauseSection';
import { NavBar } from '@/app/components/NavBar';

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

      <NavBar />

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
          ) : donations.length <= 4 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {donations.map((d, i) => (
                <DonationCard key={d.id} donation={d} index={i} />
              ))}
            </div>
          ) : (
            <DonationMarquee donations={donations} />
          )}
        </section>

        <Divider />

        {/* (v) Good cause */}
        <GoodCauseSection />

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
