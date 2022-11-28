/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.trustedtours.com",
      "themiamiguide.com",
      "res.cloudinary.com",
      "cdn.aarp.net",
      "upload.wikimedia.org",
      "randomuser.me",
      "localhost:3000",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
