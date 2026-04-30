import { prisma } from "@/lib/prisma";
import { ImageManager } from "@/components/admin/ImageManager";

export const metadata = { title: "Images" };
export const dynamic = "force-dynamic";

export default async function ImagesPage() {
  const items = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Images</h1>
      <p className="mb-6 text-sm text-muted-fg">
        Uploadez des images puis associez-les à une clé (ex : <code>home.hero.image</code>) pour qu'elles s'affichent automatiquement.
      </p>
      <ImageManager items={items.map((i) => ({
        id: i.id, key: i.key, url: i.url, originalName: i.originalName, size: i.size,
      }))} />
    </div>
  );
}
