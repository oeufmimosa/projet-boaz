/**
 * Allowlist stricte pour `rehype-sanitize` — utilisée par `<MarkdownRenderer>`
 * pour rendre le contenu markdown des articles avec une sécurité XSS forte.
 *
 * Principe : on part de zéro et on autorise explicitement ce dont on a besoin
 * pour un article éditorial (titres, paragraphes, listes, tables, blockquotes,
 * code inline, liens). On REFUSE :
 *   - `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`, `<input>`
 *   - Tous les attributs `on*` (onerror, onclick, onload, ...)
 *   - Les `style` inline (vecteur d'attaque CSS classique)
 *   - Les `href` `javascript:` / `data:` / `vbscript:` (le helper protocols
 *     de hast-util-sanitize ne laisse passer que http/https/mailto/tel par
 *     défaut quand on précise `protocols`)
 *
 * Cette schema est testée dans `tests/unit/markdown-sanitize.test.ts` —
 * toute régression doit faire échouer les tests AVANT le déploiement.
 */
import type { Schema } from "hast-util-sanitize";

export const articleSanitizeSchema: Schema = {
  // Tags autorisés — minimaliste, dérivé du sous-ensemble GFM standard.
  tagNames: [
    "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr",
    "ul", "ol", "li",
    "strong", "em", "del", "ins", "sub", "sup", "mark",
    "blockquote", "q",
    "a",
    "code", "pre", "kbd", "samp", "var",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td",
    "abbr", "cite",
    // <h1> volontairement EXCLU : un seul H1 par page (le titre de l'article
    // est rendu hors du markdown). Si quelqu'un en met un dans le markdown,
    // il est silencieusement strippé.
  ],

  // Attributs autorisés par tag. `attributes['*']` = autorisés sur tous les
  // tags listés ci-dessus. On reste minimaliste.
  attributes: {
    "*": ["className", "id"],
    a: [
      "href",
      "title",
      // `target` autorisé mais on force `rel="noopener noreferrer"` côté
      // composant (pas via la sanitization) pour les liens externes.
      ["target", "_blank", "_self"],
      ["rel", "noopener", "noreferrer", "nofollow"],
    ],
    img: ["src", "alt", "title", "width", "height", "loading"],
    th:  ["scope", "colSpan", "rowSpan", "align"],
    td:  ["colSpan", "rowSpan", "align"],
    code: ["className"], // pour le highlight de langue (ex. "language-ts")
    abbr: ["title"],
  },

  // Schémas d'URL autorisés pour les attributs `href` / `src`.
  // - `http`, `https`, `mailto`, `tel` : standards
  // - PAS de `javascript:`, `data:`, `vbscript:` : vecteurs XSS connus
  // - `#` (ancres internes) est géré séparément par le helper, pas besoin
  //   de l'ajouter ici.
  protocols: {
    href: ["http", "https", "mailto", "tel"],
    src:  ["http", "https"],
  },

  // Attributs de style et événements explicitement REFUSÉS.
  // (La sanitize ne laisse rien passer qui n'est pas dans `attributes` ;
  // on peut donc se contenter de NE PAS les lister. Mais on documente
  // l'intention.)
  // Pas de `style`, pas de `on*`, pas de `formaction`, pas de `srcset` ici.

  // Tags strippés mais leur contenu textuel est conservé.
  strip: ["script", "iframe", "style", "embed", "object", "noscript"],

  // Tags totalement supprimés (eux et leur contenu).
  clobberPrefix: "user-content-",
  clobber:       ["name", "id"], // évite la collision DOM avec les ancres user
};

/**
 * Tag `img` exclu volontairement de `tagNames` ci-dessus : les images dans
 * un article passent par les **tokens `{{img:N}}`** qui sont remplacés AVANT
 * la sanitization par notre composant `<ArticleImage>` typé. Si un rédacteur
 * écrit `![alt](url)` en markdown, l'image est strippée à la sanitization —
 * comportement voulu pour empêcher l'injection d'images externes via
 * markdown brut.
 */
