import { prisma } from "@/lib/prisma";
import { TestimonialEditor } from "@/components/admin/TestimonialEditor";

export const metadata = { title: "Témoignages (admin)" };
export const dynamic = "force-dynamic";

interface Row {
  id: string;
  quote: string;
  authorName: string;
  authorCity: string;
  rating: number;
  context: string | null;
  active: boolean;
  order: number;
}

export default async function AdminTestimonialsPage() {
  const tm = (prisma as unknown as {
    testimonial: { findMany: (a: unknown) => Promise<Row[]> };
  }).testimonial;
  const items = await tm.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Témoignages</h1>
      <p className="mb-6 text-body-sm text-text-muted">
        Affichés sur le site (TestimonialFlash dans le simulateur, sections témoignages).
      </p>
      <TestimonialEditor items={items} />
    </div>
  );
}
