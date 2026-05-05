import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export async function GoodCauseSection() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'content/good-cause.md'), 'utf-8');
  const { content } = matter(raw);

  // sanitize:false lets the inline <a target="_blank"> on the JustGiving link
  // through; without it remark-html strips raw HTML entirely.
  const processed = await remark().use(remarkHtml, { sanitize: false }).process(content);
  const htmlContent = processed.toString();

  return (
    <section id="good-cause" className="max-w-3xl mx-auto px-6 py-14">
      <h2
        className="text-warm-ink text-center mb-8"
        style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 600 }}
      >
        Support a good cause
      </h2>
      <div
        className="[&_p]:text-warm-ink [&_p]:leading-relaxed [&_p]:mb-5 [&_em]:italic [&_a]:text-crimson [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-crimson-dark"
        style={{ fontFamily: 'var(--font-lora)', fontSize: '1rem' }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </section>
  );
}
