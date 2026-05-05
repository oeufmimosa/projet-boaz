import { prisma } from "@/lib/prisma";
import { ContentEditor } from "@/components/admin/ContentEditor";

export const metadata = { title: "Contenus" };
export const dynamic = "force-dynamic";

export default async function ContenusPage() {
  const items = await prisma.content.findMany({ orderBy: { key: "asc" } });
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Contenus éditables</h1>
      <p className="mb-6 text-sm text-text-muted">
        Toutes les clés de contenu utilisées par le site. Modifiez la valeur, choisissez le type
        si nécessaire, puis enregistrez. Vous pouvez ajouter une nouvelle clé en bas.
      </p>
      <ContentEditor items={items.map((i) => ({
        id: i.id, key: i.key, value: i.value,
        // type est une string en DB (SQLite); le ContentEditor attend l'union TS.
        type: i.type as "TEXT" | "RICHTEXT" | "JSON" | "IMAGE_REF",
      }))} />
    </div>
  );
}
