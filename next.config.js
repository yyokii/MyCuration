/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // TODO: remove this when we dont need it anymore
    domains: ['lh3.googleusercontent.com', `images.unsplash.com`],
  },
}

module.exports = nextConfig
