/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["d3t32hsnjxo7q6.cloudfront.net"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
