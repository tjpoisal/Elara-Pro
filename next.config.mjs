/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TODO(dgd911): Remove once strict-mode TS errors in src/ are resolved.
    // Run `pnpm exec tsc --noEmit` locally to see the full error list.
    ignoreBuildErrors: true,
  },
  // eslint.ignoreDuringBuilds removed — ESLint now lints .ts/.tsx files
  // correctly via eslint-config-next flat config.
};

export default nextConfig;
