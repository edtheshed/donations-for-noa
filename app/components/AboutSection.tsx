import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import Image from 'next/image';

export async function AboutSection() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'content/about.md'), 'utf-8');
  const { content } = matter(raw);

  const processed = await remark().use(remarkHtml).process(content);
  const htmlContent = processed.toString();

  return (
    <section id="about" className="max-w-3xl mx-auto px-6 py-14">
      <div
        className="[&_p]:text-warm-ink [&_p]:leading-relaxed [&_p]:mb-5 [&_em]:italic [&_a]:text-ocean [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-ocean-dark"
        style={{ fontFamily: 'var(--font-lora)', fontSize: '1rem' }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <figure className="mt-10">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-md border border-warm-border" style={{ aspectRatio: '3/2' }}>
          <Image
            src="/wedding.jpg"
            alt="Me and Mad on our wedding day, October 2025"
            fill
            quality={95}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
        <figcaption
          className="text-center text-warm-muted text-sm mt-3 italic"
          style={{ fontFamily: 'var(--font-lora)' }}
        >
          Me and Mad on our wedding day, October 2025
        </figcaption>
      </figure>
    </section>
  );
}
