/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_CONTRACT_ADDRESS: process.env.NEXT_CONTRACT_ADDRESS,
    NEXT_TOKEN_ADDRESS: process.env.NEXT_TOKEN_ADDRESS,
  },
  output: 'export',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
