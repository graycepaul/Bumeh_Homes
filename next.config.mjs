/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "i.pinimg.com",
      "images.unsplash.com",
      "source.unsplash.com",
      "your-art-cdn.com", // Add your actual image host
    ],
    minimumCacheTTL: 60,
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Required for Framer Motion in Next.js 13+
  transpilePackages: ["framer-motion"],
  // Optional: Enable React Strict Mode (helps catch animation issues)
  reactStrictMode: true,
  // Optional: Improve animation performance
  experimental: {
    optimizePackageImports: ["framer-motion"],
    scrollRestoration: true, // Smooth scroll for anchor links
  },
  // Optional: Webpack config for better motion performance
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    return config;
  },
};

export default nextConfig;
