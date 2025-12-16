import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      { hostname: "picsum.photos" },
      { hostname: "images.unsplash.com" },
      { hostname: "fmqaxnuemcmcjjgodath.supabase.co" },
      { hostname: "via.placeholder.com" },
    ],
  },
};

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/app-build-manifest\.json$/],
});

export default pwaConfig(nextConfig);
