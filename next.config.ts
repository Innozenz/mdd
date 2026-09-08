import type { NextConfig } from "next";

/**
 * En-têtes de sécurité HTTP appliqués à toutes les routes.
 *
 * Complètent les protections d'Auth.js contre les failles courantes :
 * anti-clickjacking, anti-sniffing MIME, politique de référent restrictive et
 * désactivation des capteurs sensibles. (Une CSP stricte, nécessitant des
 * nonces sur le rendu Next, est laissée hors du périmètre MVP.)
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
