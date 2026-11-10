/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bin.bnbstatic.com",
        pathname: "/static/assets/logos/**",
      },
      {
        protocol: "https",
        hostname: "bin.bnbstatic.com",
      },
      {
        protocol: "https",
        hostname: "d3t32hsnjxo7q6.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "coinpaprika.com",
      },
      {
        protocol: "https",
        hostname: "static.upbit.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL ?? "http://localhost:4100"}/api/:path*`,
      },
    ];
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
