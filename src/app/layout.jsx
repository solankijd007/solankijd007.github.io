import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { PROJECTS } from '../lib/projects'
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

// Kept under ~160 characters on purpose: past that, Google truncates the SERP
// snippet mid-sentence and the tail keywords never get read by anyone.
const description =
  'Full stack developer, 4 years shipping production SaaS in Node.js, TypeScript and React. Team lead on LogystiX and SupplierX — schema design through AWS release.'

// Social cards have no such limit, so they get the longer pitch.
const socialDescription =
  'Full stack developer with 4 years shipping production SaaS in Node.js, TypeScript and React. Team lead on LogystiX and SupplierX at AeonX Digital — from schema design through release on Docker, Nginx and AWS.'

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: title,
    template: `%s — ${SITE.name}`,
  },
  description,
  // Single-page site, so the canonical is always the root. Without this, any
  // link that arrives with a ?utm_… or #anchor suffix can be indexed as its
  // own URL and split the ranking signal.
  alternates: {
    canonical: '/',
  },
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
    // `profile` rather than `website`: the page is about a person, and it
    // unlocks the profile:first_name / last_name tags below.
    type: 'profile',
    firstName: 'Jagdish',
    lastName: 'Solanki',
    username: 'solankijd007',
    siteName: `${SITE.name} — Portfolio`,
    title,
    description: socialDescription,
    url: SITE.url,
    locale: 'en_IN',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.role}, ${SITE.specialism}`,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: socialDescription,
    images: [{ url: '/og.jpg', alt: `${SITE.name} — ${SITE.role}` }],
  },
  icons: {
    icon: [
      { url: asset('/favicon.svg'), type: 'image/svg+xml' },
      { url: asset('/icon-192.png'), sizes: '192x192', type: 'image/png' },
    ],
    shortcut: [asset('/favicon.svg')],
    // iOS ignores SVG here — it needs the raster file or it falls back to a
    // screenshot of the page when someone adds the site to their home screen.
    apple: [{ url: asset('/apple-touch-icon.png'), sizes: '180x180', type: 'image/png' }],
  },
  manifest: asset('/manifest.webmanifest'),
  // Stops Safari from turning the phone number and dates in the CV copy into
  // blue auto-links, which breaks the typography.
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Default caps Google's image preview at a thumbnail; `large` is what
      // gets the portrait shown at full size in Discover and image results.
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  /* Search Console. This is the `content` value from Google's <meta> tag — Next
     writes the element itself. Removing it un-verifies the property, so it stays
     even though verification has already succeeded. */
  verification: {
    google: '7YtvEHte9JaCd88FXt8IgTzi_dAdhGiUjgiPMco5zmo',
  },
}

export const viewport = {
  themeColor: '#050506',
  colorScheme: 'dark',
}

/* Structured data so search engines read the CV, not just the copy.

   Written as a single @graph rather than three separate <script> blocks: the
   nodes cross-reference each other by @id (page → person → work), which is what
   lets Google treat "Jagdish Solanki" as one entity instead of three unrelated
   mentions. Every node needs a stable @id for that to hold, so they are all
   anchored to the canonical URL. */

const PERSON_ID = `${SITE.url}/#person`
const PAGE_ID = `${SITE.url}/#webpage`
const SITE_ID = `${SITE.url}/#website`

const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: SITE.name,
  givenName: 'Jagdish',
  familyName: 'Solanki',
  jobTitle: SITE.role,
  email: `mailto:${SITE.email}`,
  telephone: SITE.phone,
  url: SITE.url,
  image: {
    '@type': 'ImageObject',
    url: `${SITE.url}/og.jpg`,
    width: 1200,
    height: 630,
  },
  description: SITE.summary,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bhuj',
    addressRegion: 'Gujarat',
    addressCountry: 'IN',
  },
  // `sameAs` is how a search engine confirms the GitHub and LinkedIn profiles
  // belong to the same person as this page — it is the single highest-value
  // property here for an entity-based query like "Jagdish Solanki developer".
  sameAs: [SITE.github, SITE.linkedin],
  // Deliberately no `worksFor` — schema.org reads it as *current* employment, and
  // the CV's AeonX role has an end date. Add it back only while actually employed.
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Full Stack Developer',
    occupationalCategory: '15-1252.00', // O*NET: Software Developers
    skills: 'Node.js, TypeScript, React.js, Next.js, MySQL, MongoDB, Docker, AWS',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Gujarat Technological University',
  },
  knowsLanguage: ['en', 'hi', 'gu'],
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

// The shipped products, so "selected work" is machine-readable rather than
// four headings a crawler has to infer meaning from.
const workList = {
  '@type': 'ItemList',
  '@id': `${SITE.url}/#work`,
  name: 'Selected work',
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  numberOfItems: PROJECTS.length,
  itemListElement: PROJECTS.map((project, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'WebApplication',
      name: project.name,
      url: project.href,
      description: project.description,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web browser',
      author: { '@id': PERSON_ID },
    },
  })),
}

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': SITE_ID,
      url: `${SITE.url}/`,
      name: `${SITE.name} — Portfolio`,
      description,
      inLanguage: 'en',
      publisher: { '@id': PERSON_ID },
    },
    {
      // ProfilePage, not WebPage: this page IS the person's profile, and the
      // mainEntity link is what tells Google which node the page is *about*.
      '@type': 'ProfilePage',
      '@id': PAGE_ID,
      url: `${SITE.url}/`,
      name: title,
      description,
      isPartOf: { '@id': SITE_ID },
      about: { '@id': PERSON_ID },
      mainEntity: { '@id': PERSON_ID },
      inLanguage: 'en',
      primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE.url}/og.jpg` },
      hasPart: [workList],
    },
    person,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
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
