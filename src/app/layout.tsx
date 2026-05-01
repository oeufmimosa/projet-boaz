import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";

// Inter pour le texte courant : 2 graisses (limite mobile).
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-body",
  display: "swap",
});

// Plus Jakarta Sans pour les titres : 2 graisses (700/800 d'après le brief).
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: env.site.name, template: `%s — ${env.site.name}` },
  description: "Rénovation énergétique : aides, isolation, pompes à chaleur, photovoltaïque.",
  metadataBase: new URL(env.site.url),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-body bg-bg text-text">{children}</body>
    </html>
  );
}
