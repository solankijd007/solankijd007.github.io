'use client';

import { useEffect, useRef } from 'react';
import { useReveal } from '../lib/useReveal';

const PROJECTS = [
  {
    id: '01',
    name: 'LogystiX',
    domain: 'logystix.cloud',
    href: 'https://logystix.cloud',
    status: 'Live',
    role: 'Team lead · delivered end to end',
    description:
      'SaaS logistics platform taken from architecture through production launch — inquiry and quotation flows on multi-tenant, role-based access.',
    stack: ['Node.js', 'TypeScript', 'React.js', 'MySQL', 'Docker'],
  },
  {
    id: '02',
    name: 'SupplierX',
    domain: 'aeonx.supplierx.cloud',
    href: 'https://aeonx.supplierx.cloud',
    status: 'In development',
    role: 'Backend architecture & delivery',
    description:
      'Procure-to-Pay SaaS: supplier onboarding with PAN/GST verification, purchase order and approval workflows, and SAP integration on a multi-tenant Node.js backend.',
    stack: ['Node.js', 'TypeScript', 'React.js', 'MySQL'],
  },
  {
    id: '03',
    name: 'Hunter Home CMS',
    domain: 'hunterhome.co.nz',
    href: 'https://hunterhome.co.nz',
    status: 'Live',
    role: 'Backend & integrations',
    description:
      'Admin and content-management backend for a New Zealand retailer, built on the BigCommerce API.',
    stack: ['Node.js', 'BigCommerce API'],
  },
  {
    id: '04',
    name: 'DIT Academy',
    domain: 'academy.ditcloud.in',
    href: 'https://academy.ditcloud.in',
    status: 'Live',
    role: 'Full stack · also taught on it',
    description:
      'Training platform for the company internship programme, where I also taught Node.js and Python to interns.',
    stack: ['Node.js', 'React.js', 'MySQL'],
  },
];

const ALSO_DELIVERED = [
  'Memory Kite',
  'PHC',
  'Afford A Boost',
  'Arabic Book A Month (custom Shopify app)',
];

export default function Projects() {
  const sectionRef = useReveal();
  const gridRef = useRef(null);

  // One delegated pointer listener for the whole grid drives the hover glow on
  // whichever card is under the cursor — cheaper than a handler per card, and
  // it only does work while the pointer is actually inside the grid.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let frame = 0;

    const onPointerMove = (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const card = event.target.closest?.('[data-card]');
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--gx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--gy', `${event.clientY - rect.top}px`);
      });
    };

    grid.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      grid.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-ink-2 px-6 py-24 md:px-10 md:py-32 lg:px-14"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-2.5" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col justify-between gap-6 border-b border-line pb-10 md:mb-20 md:flex-row md:items-end">
          <div>
            <p
              data-reveal
              className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-accent"
            >
              <span className="h-px w-8 bg-accent/60" />
              Selected work
            </p>
            <h2
              data-reveal
              style={{ '--d': '80ms' }}
              className="max-w-2xl text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              Products in{' '}
              <span className="font-serif italic text-accent-soft">
                production
              </span>
              .
            </h2>
          </div>
          <p
            data-reveal
            style={{ '--d': '160ms' }}
            className="max-w-sm text-[15px] font-light leading-relaxed text-white/50 md:text-right"
          >
            Platforms I designed, built and released — most of them still serving
            customers today.
          </p>
        </div>

        <div ref={gridRef} className="grid gap-6 md:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <article
              key={project.id}
              data-card
              data-reveal
              style={{ '--d': `${index * 90}ms` }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-ink-3/60 p-8 transition-colors duration-500 hover:border-accent/35 md:p-10"
            >
              {/* Cursor-following glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(340px circle at var(--gx, 50%) var(--gy, 50%), rgba(45,212,191,0.09), transparent 70%)',
                }}
              />

              <div className="relative flex items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.3em] text-white/30">
                    {project.id}
                  </p>
                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/45">{project.role}</p>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wider ${
                    project.status === 'Live'
                      ? 'border-accent/30 bg-accent/10 text-accent-soft'
                      : 'border-white/15 bg-white/5 text-white/50'
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <p className="relative mt-6 flex-1 text-[15px] font-light leading-relaxed text-white/60">
                {project.description}
              </p>

              <div className="relative mt-8 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-line bg-white/3 px-2.5 py-1 text-[13px] text-white/55"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="relative mt-8 border-t border-line pt-6">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors duration-300 hover:text-accent"
                >
                  {project.domain}
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div
          data-reveal
          style={{ '--d': '120ms' }}
          className="mt-14 flex flex-col gap-4 border-t border-line pt-10 sm:flex-row sm:items-center sm:gap-8"
        >
          <p className="shrink-0 text-xs font-medium uppercase tracking-[0.28em] text-white/35">
            Also delivered
          </p>
          <ul className="flex flex-wrap gap-x-3 gap-y-2">
            {ALSO_DELIVERED.map((name, index) => (
              <li key={name} className="text-sm text-white/55">
                {name}
                {index < ALSO_DELIVERED.length - 1 && (
                  <span className="ml-3 text-white/15" aria-hidden="true">
                    /
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
