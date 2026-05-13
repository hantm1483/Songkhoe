/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.cookiebot.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com https://*.supabase.co https://*.supabase.in; connect-src 'self' https://ngkahrxcqmjfkozczfpx.supabase.co https://*.supabase.co https://auth.us-east-1.supabase.com wss://*.supabase.co https://cdn.cookiebot.com https://cdnjs.cloudflare.com; frame-src 'self' https://*.supabase.co;",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;