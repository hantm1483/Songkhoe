/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.cookiebot.com https://cdnjs.cloudflare.com https://static.cloudflareinsights.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;