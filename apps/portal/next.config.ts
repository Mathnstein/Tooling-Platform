import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Essential for Docker
};

export default nextConfig;
