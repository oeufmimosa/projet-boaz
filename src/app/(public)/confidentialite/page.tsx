import { LegalPage } from "@/components/legal/LegalPage";
import { getContent } from "@/lib/content";

export const metadata = { title: "Politique de confidentialité" };

export default async function Page() {
  const [title, body] = await Promise.all([
    getContent("legal.privacy.title", "Confidentialité"),
    getContent("legal.privacy.body"),
  ]);
  return <LegalPage title={title} body={body} />;
}
