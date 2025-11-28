import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      { hostname: "picsum.photos" },
      { hostname: "images.unsplash.com" },
      { hostname: "fmqaxnuemcmcjjgodath.supabase.co" },
    ],
  },
};

export default nextConfig;
