/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    'twilio',
    'drizzle-orm',
    '@neondatabase/serverless',
    'drizzle-kit',
  ],
};

export default nextConfig;
