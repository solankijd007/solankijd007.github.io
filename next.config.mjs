/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/solankijd007' : '';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath,
  images: {
    unoptimized: true,
  },
  // Exposed so plain <a>/<img> tags pointing at /public can prefix the basePath
  // themselves — Next only rewrites it automatically for next/link and next/image.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig
