/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // FIX: Moved reactCompiler inside experimental object to adhere to Next.js config schema
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
