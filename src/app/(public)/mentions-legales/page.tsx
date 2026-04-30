import { LegalPage } from "@/components/legal/LegalPage";
import { getContent } from "@/lib/content";

export const metadata = { title: "Mentions légales" };

export default async function Page() {
  const [title, body] = await Promise.all([
    getContent("legal.mentions.title", "Mentions légales"),
    getContent("legal.mentions.body"),
  ]);
  return <LegalPage title={title} body={body} />;
}
