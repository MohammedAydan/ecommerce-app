import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns: [
      {
        protocol: "https",
        hostname: "e-commerce-api-mag.runasp.net",
      },
      {
        protocol: "http",
        hostname: "e-commerce-api-mag.runasp.net",
      }, 
      {
        protocol: "http",
        hostname: "localhost",
        port: "5070",
      }
    ]
  }
};

export default nextConfig;
