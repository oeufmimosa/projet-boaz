/** @type {import('next').NextConfig} */

/**
 * Headers HTTP de sécurité appliqués à toutes les routes du site.
 *
 * - HSTS : force HTTPS en prod (1 an, sous-domaines inclus, eligible preload)
 * - X-Content-Type-Options : empêche le MIME sniffing
 * - X-Frame-Options SAMEORIGIN : protège du clickjacking ; SAMEORIGIN
 *   plutôt que DENY parce que l'éditeur miroir charge /admin/editor/preview/*
 *   dans une iframe sur la même origine.
 * - Referrer-Policy : ne fuit pas l'URL d'origine vers les sites externes
 * - Permissions-Policy : désactive caméra / micro / géoloc par défaut
 * - Content-Security-Policy : verrouille les sources de scripts, images,
 *   styles, connexions. 'unsafe-inline' sur style et script reste nécessaire
 *   à cause de Next.js (hydration scripts inline) et Tailwind (style inline).
 *   Les domaines des banques d'images sont autorisés pour servir les
 *   placeholders et les images stock embarquées.
 *   Elfsight (elfsightcdn.com / *.elfsight.com) : widget d'avis Google sur la
 *   home — charge un script, des avatars googleusercontent et appelle son API.
 *   Vercel Analytics (va.vercel-scripts.com / *.vercel-insights.com).
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options",        value: "SAMEORIGIN" },
  { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://elfsightcdn.com https://*.elfsightcdn.com https://*.elfsight.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://*.elfsightcdn.com https://*.elfsight.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://placehold.co https://*.elfsightcdn.com https://*.elfsight.com https://*.googleusercontent.com https://*.ggpht.com https://maps.gstatic.com https://maps.googleapis.com",
      "font-src 'self' data: https://*.elfsightcdn.com https://*.elfsight.com",
      "connect-src 'self' https://api.unsplash.com https://api.pexels.com https://*.elfsightcdn.com https://*.elfsight.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.vercel-insights.com",
      "media-src 'self' blob:",
      "frame-src 'self' https://*.elfsight.com https://*.elfsightcdn.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const config = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pas de source maps client en prod : évite que le code source soit
  // visible dans DevTools en clair.
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default config;
