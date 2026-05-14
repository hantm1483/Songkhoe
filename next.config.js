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
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.cookiebot.com https://cdnjs.cloudflare.com https://static.cloudflareinsights.com https://browser.sentry-cdn.com; script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.cookiebot.com https://cdnjs.cloudflare.com https://static.cloudflareinsights.com https://browser.sentry-cdn.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;