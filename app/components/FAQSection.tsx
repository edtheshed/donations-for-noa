const faqs = [
  {
    q: 'How do I donate blood?',
    a: 'You can register to donate at your nearest donation centre. In the UK, visit the NHS Blood and Transplant website (www.blood.co.uk) to find your nearest session and book an appointment.',
  },
  {
    q: 'Who is eligible to donate?',
    a: 'Most healthy adults aged 17–65 can donate. Some medical conditions, medications, recent sexual activies or travel may affect eligibility. The donation centre will check this with you before you donate. One common misconception (that I shared until recently) is that gay or bisexual men cannot donate blood. While this used to be true, the rules have been gradually changing since 2011. Under current guidelines, no-one is excluded based on sexual identity - though you are ineligible to give blood if you have had anal sex with a new sexual partner in the last three months.',
  },
  {
    q: 'How long does a donation take?',
    a: 'The donation itself takes around 10 minutes. Allow about an hour in total to account for registration, a health check, the donation, and a short rest period with refreshments afterwards.',
  },
  {
    q: 'How often can I donate?',
    a: 'In the UK, men can donate every 12 weeks and women every 16 weeks. This allows your body time to replenish the donated blood fully.',
  },
  {
    q: 'Where can I find my nearest donation centre?',
    a: 'Use the session finder at www.blood.co.uk to search by postcode. Donation sessions are held at permanent donor centres and at temporary venues such as community halls and workplaces.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="max-w-3xl mx-auto px-6 py-14">
      <h2
        className="text-warm-ink text-center mb-10"
        style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 600 }}
      >
        Frequently asked questions
      </h2>

      <div className="space-y-3">
        {faqs.map(({ q, a }) => (
          <details
            key={q}
            className="group border border-warm-border rounded-xl overflow-hidden"
          >
            <summary
              className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-warm-ink font-medium select-none hover:bg-crimson-light/40 transition-colors duration-150"
              style={{ fontFamily: 'var(--font-lora)', fontSize: '0.95rem' }}
            >
              {q}
              <svg
                className="w-4 h-4 flex-shrink-0 text-warm-muted transition-transform duration-200 group-open:rotate-180"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p
              className="px-5 py-4 text-warm-muted leading-relaxed border-t border-warm-border"
              style={{ fontFamily: 'var(--font-lora)', fontSize: '0.95rem' }}
            >
              {a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
