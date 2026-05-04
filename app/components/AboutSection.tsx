import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export async function AboutSection() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'content/about.md'), 'utf-8');
  const { content } = matter(raw);

  const processed = await remark().use(remarkHtml).process(content);
  const htmlContent = processed.toString();

  return (
    <section id="about" className="max-w-3xl mx-auto px-6 py-14">
      <div
        className="[&_p]:text-warm-ink [&_p]:leading-relaxed [&_p]:mb-5 [&_em]:italic [&_a]:text-crimson [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-crimson-dark"
        style={{ fontFamily: 'var(--font-lora)', fontSize: '1rem' }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </section>
  );
}
