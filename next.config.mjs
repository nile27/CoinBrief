/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bin.bnbstatic.com",
        pathname: "/static/assets/logos/**",
      },
    ],
    domains: [
      "bin.bnbstatic.com",
      "d3t32hsnjxo7q6.cloudfront.net",
      "coinpaprika.com",
      "static.upbit.com",
    ],
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
