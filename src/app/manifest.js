import { SITE, asset } from '../lib/site'

// Emitted as /manifest.webmanifest at build time.
export const dynamic = 'force-static'

export default function manifest() {
  return {
    name: `${SITE.name} — ${SITE.role}`,
    short_name: SITE.name,
    description: SITE.summary,
    start_url: asset('/'),
    display: 'standalone',
    background_color: '#050506',
    theme_color: '#050506',
    // PNG rather than the SVG favicon: Android's installer and iOS both want a
    // raster icon, and `maskable` keeps the badge from being cropped into a
    // circle on Android launchers.
    icons: [
      { src: asset('/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: asset('/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: asset('/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
