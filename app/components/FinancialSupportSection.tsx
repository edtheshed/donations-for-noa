export function FinancialSupportSection() {
  return (
    <section id="financial-support" className="max-w-3xl mx-auto px-6 py-14">
      <h2
        className="text-warm-ink text-center mb-8"
        style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 600 }}
      >
        Support financially
      </h2>
      <p
        className="text-warm-ink leading-relaxed mb-5"
        style={{ fontFamily: 'var(--font-lora)', fontSize: '1rem' }}
      >
        If you are not able to give blood, or would like to do more, you can also support financially. The money raised will go to the Malaria Consortium. You can donate via our{' '}
        <a
          href="https://www.justgiving.com/page/donations-for-noa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-crimson underline underline-offset-2 hover:text-crimson-dark transition-colors duration-150"
        >
          JustGiving page
        </a>
        .
      </p>
      <p
        className="text-warm-ink leading-relaxed mb-5"
        style={{ fontFamily: 'var(--font-lora)', fontSize: '1rem' }}
      >
        Malaria kills around 600,000 people annually, mostly children under 5 in sub-Saharan Africa and Asia. While there isn&rsquo;t a very strong link between Malaria Consortium and recent events in our lives, I remain someone who believes in the importance of good evidence when making donation decisions (or really any kind of decision) - and the evidence for the effectiveness malaria prevention and treatment is overwhelming. Seasonal malaria chemoprevention, where children are provided with a full course of antimalarial medicines prophylactically during peak malaria season, can protect a child for as little as £5. So please trust me that this is a good use of your money. Losing a child is always a tragedy, wherever it occurs, but particularly when it could easily have been prevented using low-cost medicines.
      </p>
    </section>
  );
}
