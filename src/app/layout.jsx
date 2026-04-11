import './globals.css'

export const metadata = {
  title: 'Spider Portfolio',
  description: 'Creative full-stack portfolio built with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
