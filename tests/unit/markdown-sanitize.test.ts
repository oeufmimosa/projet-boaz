/**
 * Tests de sécurité XSS — non négociables.
 *
 * Chaque vecteur d'attaque listé ici DOIT être strippé/neutralisé par le
 * pipeline `unified() → remarkParse → remarkRehype → rehypeSanitize`
 * configuré avec `articleSanitizeSchema`.
 *
 * Si un seul de ces tests échoue, le bug est bloquant pour la mise en prod.
 */

import { describe, it, expect } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { articleSanitizeSchema } from "@/lib/markdown-sanitize";

async function renderSanitized(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSanitize, articleSanitizeSchema)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
  return String(file);
}

describe("markdown-sanitize — vecteurs XSS classiques (script, iframe, embed)", () => {
  it("strippe les <script> (le tag, le contenu textuel reste mais n'est pas exécuté)", async () => {
    const md = `Avant <script>alert('xss')</script> Après.`;
    const out = await renderSanitized(md);
    // L'important : le tag <script> doit avoir disparu. Son contenu
    // textuel ("alert(...)") peut rester comme texte brut puisque le
    // browser ne l'exécutera pas hors d'un tag <script>.
    expect(out).not.toContain("<script");
    expect(out).not.toContain("</script");
  });

  it("strippe les <script> via HTML brut", async () => {
    const md = `<script>document.cookie="stolen"</script>`;
    const out = await renderSanitized(md);
    expect(out).not.toContain("<script");
    expect(out).not.toContain("document.cookie");
  });

  it("strippe les <iframe>", async () => {
    const md = `<iframe src="https://evil.com"></iframe>`;
    const out = await renderSanitized(md);
    expect(out).not.toContain("<iframe");
  });

  it("strippe les <object> et <embed>", async () => {
    const md = `<object data="evil.swf"></object><embed src="evil.swf">`;
    const out = await renderSanitized(md);
    expect(out).not.toContain("<object");
    expect(out).not.toContain("<embed");
  });

  it("strippe les <form> et <input>", async () => {
    const md = `<form action="evil"><input type="password"></form>`;
    const out = await renderSanitized(md);
    expect(out).not.toContain("<form");
    expect(out).not.toContain("<input");
  });
});

describe("markdown-sanitize — handlers d'événements DOM (onerror, onclick, onload)", () => {
  it("strippe `onerror` sur une <img>", async () => {
    // Note : <img> est de toute façon strippée puisqu'absente de la
    // tagNames allowlist (les images articles passent par {{img:N}}).
    const md = `<img src="x" onerror="alert(1)">`;
    const out = await renderSanitized(md);
    expect(out).not.toContain("onerror");
    expect(out).not.toContain("alert");
  });

  it("strippe `onclick` sur un <a>", async () => {
    const md = `<a href="https://example.com" onclick="alert(1)">click</a>`;
    const out = await renderSanitized(md);
    expect(out).not.toContain("onclick");
    expect(out).not.toContain("alert");
  });

  it("strippe `onload` sur un <body> (HTML brut)", async () => {
    const md = `<body onload="alert(1)">test</body>`;
    const out = await renderSanitized(md);
    expect(out).not.toContain("onload");
  });

  it("strippe les attributs on* arbitraires", async () => {
    const md = `<a href="https://x.com" onmouseover="x()">y</a>`;
    const out = await renderSanitized(md);
    expect(out).not.toContain("onmouseover");
  });
});

describe("markdown-sanitize — protocoles d'URL dangereux", () => {
  it("strippe les liens `javascript:`", async () => {
    const md = `[click](javascript:alert(1))`;
    const out = await renderSanitized(md);
    expect(out).not.toContain("javascript:");
    expect(out).not.toContain("alert");
  });

  it("strippe les liens `vbscript:`", async () => {
    const md = `[x](vbscript:msgbox(1))`;
    const out = await renderSanitized(md);
    expect(out).not.toContain("vbscript:");
  });

  it("strippe `data:` URI dans les hrefs", async () => {
    const md = `[x](data:text/html,<script>alert(1)</script>)`;
    const out = await renderSanitized(md);
    expect(out).not.toContain("data:");
    expect(out).not.toContain("<script");
  });

  it("autorise les liens https et mailto", async () => {
    const out = await renderSanitized(
      `[lien](https://example.com) [mail](mailto:a@b.com) [tel](tel:0102030405)`,
    );
    expect(out).toContain('href="https://example.com"');
    expect(out).toContain('href="mailto:a@b.com"');
    expect(out).toContain('href="tel:0102030405"');
  });
});

describe("markdown-sanitize — attributs `style` et `srcset`", () => {
  it("strippe les attributs `style` inline", async () => {
    const md = `<p style="background: url(javascript:alert(1))">x</p>`;
    const out = await renderSanitized(md);
    expect(out).not.toContain("style=");
    expect(out).not.toContain("javascript:");
  });

  it("strippe `srcset` (vecteur connu)", async () => {
    const md = `<img src="x" srcset="javascript:alert(1)">`;
    const out = await renderSanitized(md);
    expect(out).not.toContain("srcset");
  });
});

describe("markdown-sanitize — markdown image syntax (interdite)", () => {
  it("strippe les images en markdown standard `![alt](url)`", async () => {
    // Conformément à la décision : les images passent par {{img:N}} + le
    // composant <ArticleImage> typé. Toute image markdown brute est strippée.
    const md = `![evil](https://attacker.com/track.gif)`;
    const out = await renderSanitized(md);
    expect(out).not.toContain("<img");
  });
});

describe("markdown-sanitize — contenu légitime préservé", () => {
  it("conserve les titres H2-H6", async () => {
    const out = await renderSanitized(`## Titre 2\n\n### Titre 3\n\n#### Titre 4`);
    expect(out).toContain("<h2>");
    expect(out).toContain("<h3>");
    expect(out).toContain("<h4>");
  });

  it("strippe le H1 (un seul H1 par page, rendu hors markdown)", async () => {
    const out = await renderSanitized(`# H1 markdown`);
    expect(out).not.toContain("<h1");
  });

  it("conserve les listes, blockquotes, code, tables", async () => {
    const md = `
- item 1
- item 2

> citation

\`code\`

| a | b |
|---|---|
| 1 | 2 |
`;
    const out = await renderSanitized(md);
    expect(out).toContain("<ul>");
    expect(out).toContain("<blockquote>");
    expect(out).toContain("<code>");
    expect(out).toContain("<table>");
  });

  it("conserve `<strong>`, `<em>`, `<del>`", async () => {
    const out = await renderSanitized(`**gras** *italique* ~~barré~~`);
    expect(out).toContain("<strong>");
    expect(out).toContain("<em>");
    expect(out).toContain("<del>");
  });
});
