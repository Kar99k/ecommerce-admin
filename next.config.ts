import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable compression
  compress: true,

  // Image optimization settings
  images: {
    domains: ["res.cloudinary.com"],
    // Enable image optimization
    minimumCacheTTL: 60,
    formats: ["image/webp"],
    // Disable blur placeholder for better performance
    disableStaticImages: true,
    // Configure image device sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Configure image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable webpack compression plugin
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };
    }
    return config;
  },

};

export default nextConfig;
