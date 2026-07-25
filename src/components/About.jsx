'use client';

import { PORTRAITS, usePortrait } from '../lib/portraits';
import { SITE } from '../lib/site';
import { useReveal } from '../lib/useReveal';
import { PortraitSweep } from './PortraitSwap';

const STATS = [
  { value: '4', suffix: ' yrs', label: 'Building for production' },
  { value: '12', suffix: '+', label: 'Client products shipped' },
  { value: '4', suffix: '', label: 'Developers led as team lead' },
];

const SKILLS = [
  {
    group: 'Languages',
    items: ['TypeScript', 'JavaScript', 'PHP', 'Python', 'Java', 'C', 'C++'],
  },
  {
    group: 'Backend',
    items: [
      'Node.js',
      'Express.js',
      'Next.js',
      'REST APIs',
      'GraphQL',
      'Socket.IO',
      'Microservices',
      'FastAPI',
    ],
  },
  {
    group: 'Frontend',
    items: ['React.js', 'Next.js', 'React Native', 'Tailwind CSS', 'Material UI'],
  },
  {
    group: 'Databases',
    items: ['MySQL', 'MongoDB', 'PostgreSQL', 'Redis'],
  },
  {
    group: 'Cloud & DevOps',
    items: ['Docker', 'AWS', 'Nginx', 'CI/CD automation', 'Linux'],
  },
  {
    group: 'Integrations',
    items: ['Shopify API', 'BigCommerce API', 'Payment gateways'],
  },
];

export default function About() {
  const sectionRef = useReveal();
  // Shared with the Hero — clicking either portrait switches both.
  const { index, swaps, next } = usePortrait();

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-ink-2 px-6 py-24 md:px-10 md:py-32 lg:px-14"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-2.5" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-24">
          {/* Portrait */}
          <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
            {/* Ratio matches the source file so nothing is cropped, and the width
                is capped — the photo is 410x530, so a wider box would just be
                upscaling it. */}
            {/* eslint-disable @next/next/no-img-element */}
            <button
              type="button"
              onClick={next}
              aria-label={`Portrait of ${SITE.name}. Click to switch photo.`}
              className="portrait-card group relative mx-auto block aspect-41/53 w-full max-w-sm overflow-hidden rounded-2xl border border-line transition-transform duration-300 active:scale-[0.99] lg:max-w-md"
            >
              {PORTRAITS.map((photo, i) => (
                <span
                  key={photo.label}
                  data-active={i === index}
                  className="portrait-plate absolute inset-0 block"
                >
                  {/* Pre-optimized WebP on a static export — next/image would
                      add JS without optimizing anything. */}
                  <img
                    src={photo.src}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="about-plate h-full w-full object-cover object-center"
                  />
                </span>
              ))}

              <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-2 via-transparent to-transparent" />

              <PortraitSweep swaps={swaps} />
            </button>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-8">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                    {stat.value}
                    <span className="text-accent">{stat.suffix}</span>
                  </p>
                  <p className="mt-2 text-xs leading-snug text-white/45">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Copy */}
          <div>
            <p
              data-reveal
              className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-accent"
            >
              <span className="h-px w-8 bg-accent/60" />
              About
            </p>

            <h2
              data-reveal
              style={{ '--d': '80ms' }}
              className="max-w-2xl text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              I own features from{' '}
              <span className="font-serif italic text-accent-soft">
                schema to ship
              </span>
              .
            </h2>

            <div
              data-reveal
              style={{ '--d': '160ms' }}
              className="mt-8 max-w-2xl space-y-6 text-lg font-light leading-relaxed text-white/65"
            >
              <p>
                I&apos;m a full stack developer based in Bhuj, Gujarat, with four years
                spent shipping production web products in Node.js, TypeScript and
                React.js. Most of that time has been on real client software with real
                deadlines — not prototypes.
              </p>
              <p>
                At AeonX Digital I joined as team lead and delivered{' '}
                <span className="text-white">LogystiX</span>, a SaaS logistics platform,
                from architecture through production launch. I also built{' '}
                <span className="text-white">SupplierX</span>, a multi-tenant
                supplier-management SaaS. I ran the release side too — Dockerised
                environments, Nginx, SSL and CI/CD pipelines on AWS.
              </p>
              <p>
                Alongside delivery I handle onboarding for new joiners and have taught
                Node.js and Python to interns at DIT Academy — which keeps me honest
                about writing code other people have to read.
              </p>
            </div>

            {/* Skills */}
            <div
              data-reveal
              style={{ '--d': '240ms' }}
              className="mt-14 border-t border-line pt-10"
            >
              <h3 className="mb-8 text-xs font-medium uppercase tracking-[0.28em] text-white/40">
                Technical skills
              </h3>

              <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {SKILLS.map((skill) => (
                  <div key={skill.group}>
                    <dt className="mb-3 text-sm font-medium text-white">{skill.group}</dt>
                    <dd className="flex flex-wrap gap-2">
                      {skill.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-md border border-line bg-white/3 px-2.5 py-1 text-[13px] text-white/60 transition-colors duration-300 hover:border-accent/40 hover:text-white"
                        >
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
