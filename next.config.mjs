/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  async redirects() {
    return [
      { source: "/galerie", destination: "/oeuvres", permanent: true },
      { source: "/galerie/:id", destination: "/oeuvres/:id", permanent: true },
      { source: "/admin/galerie", destination: "/admin/oeuvres", permanent: true },
      {
        source: "/admin/galerie/nouvelle",
        destination: "/admin/oeuvres/nouvelle",
        permanent: true,
      },
      {
        source: "/admin/galerie/edit",
        destination: "/admin/oeuvres/edit",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Pages HTML : ne pas garder d'anciennes versions en cache navigateur / proxy
        source: "/((?!_next/static|_next/image|images/|favicon.ico).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        source: "/version.json",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
