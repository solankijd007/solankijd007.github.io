'use client';

import { useReveal } from '../lib/useReveal';

const ROLES = [
  {
    company: 'AeonX Digital Solutions Pvt Ltd',
    title: 'Full Stack Developer — Team Lead',
    period: 'Sep 2024 – Dec 2025',
    points: [
      'Joined as team lead and delivered LogystiX, a SaaS logistics platform, from architecture through production launch — owning the Node.js / TypeScript backend and the React front end.',
      'Led a team of 4 developers: sprint planning, task breakdown, code review and release sign-off.',
      'Built SupplierX, a supplier-management SaaS — purchase order and approval workflows on a multi-tenant Node.js backend.',
      'Owned deployment end to end — Dockerised environments, Nginx, SSL and CI/CD pipelines on AWS.',
    ],
    stack: ['Node.js', 'Express', 'TypeScript', 'React.js', 'Next.js', 'MySQL', 'Docker', 'AWS'],
  },
  {
    company: 'DIT Interactive Pvt Ltd',
    title: 'Full Stack Developer',
    period: 'Jun 2022 – Aug 2024',
    points: [
      'Shipped 12+ client products across e-commerce, healthcare and services — Node.js / Express APIs with React front ends, from requirement to live release.',
      'Built e-commerce integrations on the Shopify and BigCommerce APIs, including a custom Shopify app and payment-gateway checkout flows.',
      'Handled deployment for every project server on the team: environment setup, Nginx, SSL, CI/CD automation and release rollouts.',
      'Onboarded new joiners onto the company stack and taught Node.js and Python to interns at DIT Academy.',
    ],
    stack: ['Node.js', 'Express', 'TypeScript', 'React.js', 'MySQL', 'MongoDB', 'Docker', 'Nginx'],
  },
];

export default function Experience() {
  const sectionRef = useReveal();

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      ref={sectionRef}
      className="relative w-full bg-ink px-6 py-24 md:px-10 md:py-32 lg:px-14"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 md:mb-24">
          <p
            data-reveal
            className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-accent"
          >
            <span className="h-px w-8 bg-accent/60" />
            Experience
          </p>
          <h2
            id="experience-heading"
            data-reveal
            style={{ '--d': '80ms' }}
            className="max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Four years of{' '}
            <span className="font-serif italic text-accent-soft">
              shipped software
            </span>
            .
          </h2>
        </div>

        <ol className="relative border-l border-line pl-8 md:pl-12">
          {ROLES.map((role, index) => (
            <li
              key={role.company}
              data-reveal
              style={{ '--d': `${index * 120}ms` }}
              className="relative pb-16 last:pb-0"
            >
              {/* Timeline node */}
              <span
                className="absolute -left-[calc(2rem+4.5px)] top-2 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-ink md:-left-[calc(3rem+4.5px)]"
                aria-hidden="true"
              />

              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-8">
                <h3 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                  {role.title}
                </h3>
                <p className="shrink-0 font-mono text-xs uppercase tracking-widest text-white/40">
                  {role.period}
                </p>
              </div>

              <p className="mt-1.5 text-sm font-medium text-accent-soft">{role.company}</p>

              <ul className="mt-6 space-y-3.5">
                {role.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3.5 text-[15px] font-light leading-relaxed text-white/60"
                  >
                    <span
                      className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-white/25"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-2">
                {role.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-line bg-white/3 px-2.5 py-1 text-[13px] text-white/55"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>

        {/* Education */}
        <div
          data-reveal
          style={{ '--d': '240ms' }}
          className="mt-16 flex flex-col gap-3 border-t border-line pt-10 md:flex-row md:items-baseline md:justify-between md:gap-8"
        >
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-white">
              Computer Science
            </h3>
            <p className="mt-1.5 text-sm text-white/50">Gujarat Technological University</p>
          </div>
          <p className="shrink-0 font-mono text-xs uppercase tracking-widest text-white/40">
            2022
          </p>
        </div>
      </div>
    </section>
  );
}
