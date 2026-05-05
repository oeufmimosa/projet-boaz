import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { articleSanitizeSchema } from "@/lib/markdown-sanitize";
import { ArticleImage, type ArticleImageProps } from "./ArticleImage";

/**
 * Renderer markdown sécurisé pour les articles de blog.
 *
 * Pipeline en 2 temps :
 *   1. **Résolution des tokens `{{img:N}}`** AVANT la sanitization. Chaque
 *      occurrence est remplacée par une `<ArticleImage>` typée (composant
 *      React). C'est par là que les images entrent dans le rendu — la
 *      syntaxe markdown brute `![alt](url)` reste interdite et strippée
 *      par la sanitization (cf. `articleSanitizeSchema`).
 *   2. **`react-markdown` + `remark-gfm` + `rehype-sanitize`** sur les
 *      morceaux textuels restants, avec l'allowlist stricte
 *      `articleSanitizeSchema`.
 *
 * Tests de sécurité : `tests/unit/markdown-sanitize.test.ts` couvre les
 * vecteurs XSS classiques (script, iframe, onerror, javascript:, data:,
 * style, srcset).
 */
export type InlineImageInfo = ArticleImageProps & {
  /** Position du token (1, 2, 3…) telle qu'apparue dans le markdown. */
  position: number;
};

export function MarkdownRenderer({
  content,
  inlineImages = [],
}: {
  content: string;
  /** Images inline associées à l'article, indexées par leur `position`. */
  inlineImages?: InlineImageInfo[];
}) {
  // Index par position pour résolution O(1)
  const byPosition = new Map<number, InlineImageInfo>();
  for (const img of inlineImages) {
    byPosition.set(img.position, img);
  }

  // Découpe le markdown sur les tokens `{{img:N}}` (sur leur propre ligne
  // de préférence — sinon ils sont quand même découpés). Les segments
  // textuels passent par react-markdown ; les tokens deviennent des
  // <ArticleImage>.
  const segments = splitOnImageTokens(content);

  return (
    <div className="article-prose">
      {segments.map((seg, i) => {
        if (seg.kind === "image") {
          const info = byPosition.get(seg.position);
          if (!info) {
            // Token sans image associée → on n'affiche rien (silencieux,
            // pour que la suppression d'une image n'empêche pas la lecture
            // de l'article)
            return null;
          }
          return (
            <ArticleImage
              key={i}
              src={info.src}
              alt={info.alt}
              width={info.width}
              height={info.height}
              caption={info.caption}
              attribution={info.attribution}
              attributionUrl={info.attributionUrl}
            />
          );
        }

        return (
          <ReactMarkdown
            key={i}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[rehypeSanitize, articleSanitizeSchema]]}
            components={{
              // Force `target="_blank" rel="noopener noreferrer"` sur tous
              // les liens (sécurité + SEO). On garde le href tel que
              // sanitizé.
              a: ({ href, children, ...rest }) => {
                const isExternal = typeof href === "string" && /^https?:\/\//i.test(href);
                return (
                  <a
                    {...rest}
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {seg.text}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — découpage du markdown sur les tokens `{{img:N}}`
// ─────────────────────────────────────────────────────────────────────────────

type Segment =
  | { kind: "text"; text: string }
  | { kind: "image"; position: number };

/**
 * Découpe un markdown sur les tokens `{{img:N}}` en alternant segments
 * texte et segments image. Les tokens malformés (`{{img:abc}}`) sont
 * laissés tels quels dans le texte et n'apparaîtront pas comme images
 * (mais seront rendus textuellement par react-markdown).
 *
 * Exporté pour pouvoir être testé unitairement séparément du rendu.
 */
export function splitOnImageTokens(markdown: string): Segment[] {
  const segments: Segment[] = [];
  const tokenRe = /\{\{\s*img\s*:\s*(\d+)\s*\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = tokenRe.exec(markdown)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: "text", text: markdown.slice(lastIndex, match.index) });
    }
    segments.push({ kind: "image", position: parseInt(match[1]!, 10) });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < markdown.length) {
    segments.push({ kind: "text", text: markdown.slice(lastIndex) });
  }
  return segments;
}
