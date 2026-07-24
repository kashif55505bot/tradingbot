/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Important for subdirectory deployment
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
