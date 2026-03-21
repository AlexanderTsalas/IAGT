import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    optimizePackageImports: ["gsap", "lenis", "lucide-react"],
  },
};

export default nextConfig;
