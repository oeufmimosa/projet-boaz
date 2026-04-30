import { describe, it, expect } from "vitest";
import { contactSchema } from "@/lib/validators/contact";
import { quoteSubmissionSchema } from "@/lib/validators/simulator";
import { contentUpsertSchema, articleSchema, loginSchema } from "@/lib/validators/content";

describe("contactSchema", () => {
  it("accepts a valid payload", () => {
    expect(contactSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      phone: "0123456789",
      message: "Bonjour, j'ai une question sur l'isolation.",
    }).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(contactSchema.safeParse({
      name: "Alice", email: "not-an-email", message: "Bonjour message correct",
    }).success).toBe(false);
  });

  it("rejects a too-short message", () => {
    expect(contactSchema.safeParse({
      name: "Al", email: "alice@example.com", message: "trop",
    }).success).toBe(false);
  });
});

describe("quoteSubmissionSchema", () => {
  const base = {
    answers: { logement_type: "maison", surface: 95 },
    civility: "mr" as const,
    firstName: "Alice",
    lastName: "Martin",
    email: "alice@example.com",
    phone: "0123456789",
    postalCode: "75001",
    city: "Paris",
    consent: true as const,
  };

  it("accepts a complete submission", () => {
    expect(quoteSubmissionSchema.safeParse(base).success).toBe(true);
  });

  it("rejects without consent", () => {
    expect(quoteSubmissionSchema.safeParse({ ...base, consent: false }).success).toBe(false);
  });

  it("rejects bad postal code", () => {
    expect(quoteSubmissionSchema.safeParse({ ...base, postalCode: "ABC" }).success).toBe(false);
  });
});

describe("contentUpsertSchema", () => {
  it("accepts hierarchical keys", () => {
    expect(contentUpsertSchema.safeParse({ key: "home.hero.title", value: "x" }).success).toBe(true);
  });
  it("rejects invalid key chars", () => {
    expect(contentUpsertSchema.safeParse({ key: "home/hero", value: "x" }).success).toBe(false);
  });
});

describe("articleSchema", () => {
  it("requires a slug-safe slug", () => {
    expect(articleSchema.safeParse({
      slug: "hello-world", title: "Hi", content: "x", published: false,
    }).success).toBe(true);
    expect(articleSchema.safeParse({
      slug: "Hello World", title: "Hi", content: "x", published: false,
    }).success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires email + password", () => {
    expect(loginSchema.safeParse({ email: "a@example.com", password: "pw" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "x", password: "pw" }).success).toBe(false);
  });
});
