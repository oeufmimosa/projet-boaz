import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { ContactForm } from "@/components/contact/ContactForm";
import { getContent } from "@/lib/content";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const [title, subtitle] = await Promise.all([
    getContent("contact.hero.title", "Contact"),
    getContent("contact.hero.subtitle"),
  ]);

  return (
    <Section>
      <Container className="grid max-w-5xl gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-3 text-muted-fg">{subtitle}</p>
          <ul className="mt-8 space-y-3 text-sm">
            <li><strong>Email :</strong> contact@example.com</li>
            <li><strong>Téléphone :</strong> 01 23 45 67 89</li>
            <li><strong>Horaires :</strong> Lun-Ven 9h-18h</li>
          </ul>
        </div>
        <div className="rounded border border-border bg-white p-6">
          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
