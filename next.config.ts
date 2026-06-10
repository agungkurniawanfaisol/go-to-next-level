import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["react-pannellum"],
  serverExternalPackages: [],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
