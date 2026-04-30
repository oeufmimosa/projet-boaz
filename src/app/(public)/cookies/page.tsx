import { LegalPage } from "@/components/legal/LegalPage";
import { getContent } from "@/lib/content";

export const metadata = { title: "Cookies" };

export default async function Page() {
  const [title, body] = await Promise.all([
    getContent("legal.cookies.title", "Cookies"),
    getContent("legal.cookies.body"),
  ]);
  return <LegalPage title={title} body={body} />;
}
