/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["twilio", "@neondatabase/serverless", "drizzle-orm"],
};

export default nextConfig;
