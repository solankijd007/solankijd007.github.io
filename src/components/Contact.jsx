'use client';

import { useState } from 'react';
import { SITE, asset } from '../lib/site';
import { useReveal } from '../lib/useReveal';

const CHANNELS = [
  { label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  { label: 'Phone', value: SITE.phone, href: `tel:${SITE.phoneHref}` },
  { label: 'GitHub', value: 'github.com/solankijd007', href: SITE.github },
  { label: 'LinkedIn', value: 'in/solankijd007', href: SITE.linkedin },
];

export default function Contact() {
  const sectionRef = useReveal();
  const [sent, setSent] = useState(false);

  // The site is a static export with no backend, so the form composes a mail
  // draft in the visitor's own client instead of pretending to POST somewhere.
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    const subject = `Portfolio enquiry from ${name}`;
    const body = `${message}\n\n—\n${name}\n${email}`;

    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  };

  const fieldClass =
    'w-full rounded-xl border border-line bg-white/3 px-4 py-3.5 text-[15px] text-white outline-none transition-colors duration-300 placeholder:text-white/30 focus:border-accent/50 focus:bg-white/6';

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-ink px-6 py-24 md:px-10 md:py-32 lg:px-14"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
        <div className="h-64 w-240 max-w-full rounded-full bg-accent/7 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Pitch + channels */}
          <div>
            <p
              data-reveal
              className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-accent"
            >
              <span className="h-px w-8 bg-accent/60" />
              Contact
            </p>

            <h2
              id="contact-heading"
              data-reveal
              style={{ '--d': '80ms' }}
              className="max-w-xl text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              Let&apos;s build something{' '}
              <span className="font-serif italic text-accent-soft">
                worth shipping
              </span>
              .
            </h2>

            <p
              data-reveal
              style={{ '--d': '160ms' }}
              className="mt-7 max-w-lg text-lg font-light leading-relaxed text-white/65"
            >
              Open to full stack roles and freelance work — Node.js, TypeScript and
              React. If you have a platform to build or a team that needs someone who
              can own delivery through release, I&apos;d like to hear about it.
            </p>

            <dl
              data-reveal
              style={{ '--d': '240ms' }}
              className="mt-12 grid gap-x-8 gap-y-7 border-t border-line pt-10 sm:grid-cols-2"
            >
              {CHANNELS.map((channel) => (
                <div key={channel.label}>
                  <dt className="text-xs font-medium uppercase tracking-[0.2em] text-white/35">
                    {channel.label}
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={channel.href}
                      target={channel.href.startsWith('http') ? '_blank' : undefined}
                      rel={
                        channel.href.startsWith('http') ? 'noopener noreferrer' : undefined
                      }
                      className="tap inline-block text-[15px] text-white/75 transition-colors duration-300 hover:text-accent"
                    >
                      {channel.value}
                    </a>
                  </dd>
                </div>
              ))}

              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.2em] text-white/35">
                  Based in
                </dt>
                <dd className="mt-2 text-[15px] text-white/75">{SITE.location}</dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.2em] text-white/35">
                  Resume
                </dt>
                <dd className="mt-2">
                  <a
                    href={asset(SITE.resume)}
                    download
                    className="tap inline-block text-[15px] text-white/75 transition-colors duration-300 hover:text-accent"
                  >
                    Download PDF
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* Form */}
          <div data-reveal style={{ '--d': '160ms' }} className="lg:pt-16">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-line bg-ink-2/70 p-6 md:p-9"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-white/40"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-white/40"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="message"
                  className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-white/40"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder="What are you building?"
                  className={`${fieldClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                className="group mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-medium tracking-wide text-ink transition-colors duration-300 hover:bg-accent-soft sm:w-auto"
              >
                Send message
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <p
                aria-live="polite"
                className="mt-4 text-[13px] leading-relaxed text-white/40"
              >
                {sent
                  ? 'Your mail app should be open with the message ready — hit send there.'
                  : `This opens a draft in your mail app addressed to ${SITE.email}.`}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
