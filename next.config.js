/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      // Limited CSP: do not break Next.js hydration or inline styling.
      { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'" },
    ];
    return [
      { source: '/:path*', headers: securityHeaders },
      ...['/app/:path*', '/analyse/:path*', '/previsions/:path*', '/recurrences/:path*']
        .map(source => ({ source, headers: [{ key: 'Cache-Control', value: 'private, no-store' }] })),
    ];
  },
};
module.exports = nextConfig;
