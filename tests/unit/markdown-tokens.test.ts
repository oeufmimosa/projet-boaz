import { describe, it, expect } from "vitest";
import { splitOnImageTokens } from "@/components/article/MarkdownRenderer";

describe("splitOnImageTokens", () => {
  it("renvoie un seul segment texte si pas de token", () => {
    const out = splitOnImageTokens("Lorem ipsum **dolor** sit amet.");
    expect(out).toHaveLength(1);
    expect(out[0]).toEqual({ kind: "text", text: "Lorem ipsum **dolor** sit amet." });
  });

  it("découpe sur un token unique", () => {
    const out = splitOnImageTokens("Avant\n\n{{img:1}}\n\nAprès");
    expect(out).toHaveLength(3);
    expect(out[0]).toEqual({ kind: "text", text: "Avant\n\n" });
    expect(out[1]).toEqual({ kind: "image", position: 1 });
    expect(out[2]).toEqual({ kind: "text", text: "\n\nAprès" });
  });

  it("découpe sur plusieurs tokens", () => {
    const out = splitOnImageTokens("a {{img:1}} b {{img:2}} c {{img:3}} d");
    expect(out.filter((s) => s.kind === "image")).toEqual([
      { kind: "image", position: 1 },
      { kind: "image", position: 2 },
      { kind: "image", position: 3 },
    ]);
  });

  it("tolère les espaces dans le token", () => {
    const out = splitOnImageTokens("x {{ img : 5 }} y");
    expect(out).toContainEqual({ kind: "image", position: 5 });
  });

  it("ignore les tokens malformés (laissés en texte)", () => {
    const out = splitOnImageTokens("x {{img:abc}} y {{img:}} z");
    // Aucun token reconnu : tout est en texte
    expect(out).toHaveLength(1);
    expect(out[0].kind).toBe("text");
  });

  it("commence par un token", () => {
    const out = splitOnImageTokens("{{img:1}} contenu");
    expect(out[0]).toEqual({ kind: "image", position: 1 });
    expect(out[1]).toEqual({ kind: "text", text: " contenu" });
  });

  it("finit par un token", () => {
    const out = splitOnImageTokens("contenu {{img:7}}");
    expect(out[0]).toEqual({ kind: "text", text: "contenu " });
    expect(out[1]).toEqual({ kind: "image", position: 7 });
  });
});
