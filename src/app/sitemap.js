import { SITE } from '../lib/site'

// Emitted as a real /sitemap.xml at build time — this works under `output: 'export'`.
export const dynamic = 'force-static'

// A single-page site has exactly one indexable URL. The in-page anchors
// (#about, #work, …) are deliberately NOT listed: fragments are not separate
// documents, and submitting them just gets the sitemap flagged as containing
// duplicate URLs.
export default function sitemap() {
  return [
    {
      url: `${SITE.url}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
