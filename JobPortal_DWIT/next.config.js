/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
// next.config.js

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "jobportalapi.deerwalktrainingcenter.com",
        port: "",
      },
    ],
  },
};

// module.exports = {
//   skipMiddlewareUrlNormalize: true,
// };
