import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.studio.vanpella.com",
      },
    ],
  },
};

export default nextConfig;
