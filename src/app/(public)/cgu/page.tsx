import { LegalPage } from "@/components/legal/LegalPage";
import { getContent } from "@/lib/content";

export const metadata = { title: "CGU" };

export default async function Page() {
  const [title, body] = await Promise.all([
    getContent("legal.cgu.title", "CGU"),
    getContent("legal.cgu.body"),
  ]);
  return <LegalPage title={title} body={body} />;
}
