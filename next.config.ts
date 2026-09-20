import type { NextConfig } from "next";

// Mientras NEXT_PUBLIC_SITE_LIVE no sea "true", la página se sirve con noindex
// (metadata y cabecera): es un deploy de revisión con datos pendientes.
const live = process.env.NEXT_PUBLIC_SITE_LIVE?.trim() === "true";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [96, 128, 192, 256, 384, 512],
  },
  async headers() {
    if (live) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
