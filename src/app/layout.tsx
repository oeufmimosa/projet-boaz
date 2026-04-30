import type { Metadata } from "next";
import "./globals.css";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: { default: env.site.name, template: `%s — ${env.site.name}` },
  description: "Rénovation énergétique : aides, isolation, pompes à chaleur, photovoltaïque.",
  metadataBase: new URL(env.site.url),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
