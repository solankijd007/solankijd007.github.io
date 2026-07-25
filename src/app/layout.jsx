import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { SITE, asset } from '../lib/site'

// Self-hosted at build time — no external font request at runtime.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Only the italic cut is used (display accents), so only the italic cut ships.
const serifDisplay = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-serif-display',
  display: 'swap',
})

const title = `${SITE.name} — ${SITE.role}`
const description =
  'Full stack developer with 4 years shipping production SaaS in Node.js, TypeScript and React. Team lead on LogystiX and SupplierX at AeonX Digital — from schema design through release on Docker, Nginx and AWS.'

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: title,
    template: `%s — ${SITE.name}`,
  },
  description,
  applicationName: `${SITE.name} Portfolio`,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  keywords: [
    'Jagdish Solanki',
    'Full Stack Developer',
    'Node.js Developer',
    'TypeScript',
    'React Developer',
    'Next.js',
    'SaaS Developer',
    'Bhuj',
    'Gujarat',
    'India',
  ],
  openGraph: {
    type: 'website',
    siteName: `${SITE.name} — Portfolio`,
    title,
    description,
    url: SITE.url,
    locale: 'en_IN',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og.jpg'],
  },
  icons: {
    icon: [
      { url: asset('/favicon.svg'), type: 'image/svg+xml' }
    ],
    shortcut: [asset('/favicon.svg')],
    apple: [asset('/favicon.svg')],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  themeColor: '#050506',
  colorScheme: 'dark',
}

// Structured data so search engines read the CV, not just the copy.
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  jobTitle: 'Full Stack Developer',
  email: `mailto:${SITE.email}`,
  telephone: SITE.phone,
  url: SITE.url,
  image: `${SITE.url}/og.jpg`,
  description: SITE.summary,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bhuj',
    addressRegion: 'Gujarat',
    addressCountry: 'IN',
  },
  sameAs: [SITE.github, SITE.linkedin],
  // Deliberately no `worksFor` — schema.org reads it as *current* employment, and
  // the CV's AeonX role has an end date. Add it back only while actually employed.
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Gujarat Technological University',
  },
  knowsAbout: [
    'Node.js',
    'TypeScript',
    'React.js',
    'Next.js',
    'Express.js',
    'MySQL',
    'MongoDB',
    'Docker',
    'AWS',
    'Nginx',
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${serifDisplay.variable}`}>
      <head>
        {/* Without JavaScript the IntersectionObserver never runs, so the
            [data-reveal] elements would stay at opacity 0 forever. This reveals
            them instead.

            Deliberately a <noscript> style block rather than a script that adds
            a class to <html>: that mutates the DOM before React hydrates, and
            the server/client markup then disagrees. */}
        <noscript>
          <style>
            {'[data-reveal]{opacity:1!important;transform:none!important}'}
          </style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      {/* suppressHydrationWarning covers browser extensions that stamp attributes
          on <body> before React hydrates (ColorZilla's cz-shortcut-listen, Grammarly,
          password managers). It only applies to this element's own attributes, so
          real mismatches inside the app still surface. */}
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
