import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-90277a0c-e63a-40a9-9aa1-57cb968e9a31.space-z.ai"
  ],
};

export default nextConfig;
