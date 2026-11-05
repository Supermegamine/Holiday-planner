import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Holiday-planner",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
