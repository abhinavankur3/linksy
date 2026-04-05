/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["bcryptjs", "geoip-lite"],
};

export default nextConfig;
