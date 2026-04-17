import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Essential for Docker
  turbopack: {
    root: process.cwd(),
  }
};

export default nextConfig;
