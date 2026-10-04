/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PGlite (WASM postgres) must stay external to the Next.js bundle.
  // (Next 14 key; renamed to `serverExternalPackages` in Next 15.)
  experimental: {
    serverComponentsExternalPackages: ["@electric-sql/pglite"]
  }
};

export default nextConfig;
