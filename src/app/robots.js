import { SITE } from '../lib/site'

// Emitted as a real /robots.txt at build time — this works under `output: 'export'`.
export const dynamic = 'force-static'

export default function robots() {
  return {
    rules: [
      // Nothing is disallowed. The 404 is kept out of the index by its own
      // `noindex` tag, and blocking it here would be worse — a crawler that
      // cannot fetch the page never reads the noindex, so a stray inbound link
      // can still get the URL listed.
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
