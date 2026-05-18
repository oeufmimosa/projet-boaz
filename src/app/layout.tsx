import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";
import { OrganizationJsonLd } from "@/components/seo/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-body",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

const SITE_NAME = "Groupe Climat Hexagone";
const DEFAULT_DESCRIPTION =
  "Pompe à chaleur, isolation, photovoltaïque : faites estimer vos aides en 2 minutes et profitez d'un accompagnement clé en main par des artisans RGE.";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Rénovation énergétique, aides cumulées`,
    template: `%s — ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(env.site.url),
  alternates: { canonical: "/" },
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  category: "rénovation énergétique",
  keywords: [
    "rénovation énergétique",
    "MaPrimeRénov'",
    "pompe à chaleur",
    "isolation thermique extérieure",
    "photovoltaïque",
    "ballon thermodynamique",
    "chauffe-eau solaire",
    "système solaire combiné",
    "artisan RGE",
    "aides rénovation 2025",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Rénovation énergétique, aides cumulées`,
    description: DEFAULT_DESCRIPTION,
    url: env.site.url,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `Logo ${SITE_NAME}`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Rénovation énergétique`,
    description: DEFAULT_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-32.png",  sizes: "32x32",   type: "image/png" },
      { url: "/favicon-48.png",  sizes: "48x48",   type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F3D26",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-body bg-bg text-text">
        <OrganizationJsonLd />
        {children}
        {/* ⚠️ LOCAL ONLY — NE PAS COMMIT NE PAS PUSH */}
        <div id="troll-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
