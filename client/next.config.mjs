/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['cloud.appwrite.io'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
