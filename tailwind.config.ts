import type { Config } from "tailwindcss";

/**
 * Tailwind config — Groupe Climat Hexagon.
 * Toutes les classes Tailwind utilisées dans les composants doivent référencer
 * un token déclaré ici (lui-même branché sur une variable CSS de globals.css).
 * Aucune valeur hex en dur dans le code.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Vert foncé — palette principale
        primary: {
          50:  "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
          DEFAULT: "var(--color-primary-700)",
        },
        // Drapeau français — utilisation parcimonieuse
        fr: {
          blue:  "var(--color-fr-blue)",
          white: "var(--color-fr-white)",
          red:   "var(--color-fr-red)",
        },
        // Accent doré — CTA hero / highlights
        accent: {
          500: "var(--color-accent-500)",
          600: "var(--color-accent-600)",
          DEFAULT: "var(--color-accent-500)",
        },
        // Neutres
        bg:        "var(--color-bg)",
        surface:   "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",
        border:    "var(--color-border)",
        text:      "var(--color-text)",
        "text-muted":   "var(--color-text-muted)",
        "text-inverse": "var(--color-text-inverse)",
        // États
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error:   "var(--color-error)",
      },

      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body:    ["var(--font-body)", "system-ui", "sans-serif"],
        sans:    ["var(--font-body)", "system-ui", "sans-serif"],
      },

      fontSize: {
        // [size, { lineHeight, letterSpacing, fontWeight }]
        "display-xl": ["var(--text-display-xl)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "800" }],
        "display-lg": ["var(--text-display-lg)", { lineHeight: "1.1",  letterSpacing: "-0.015em", fontWeight: "800" }],
        "display-md": ["var(--text-display-md)", { lineHeight: "1.15", letterSpacing: "-0.01em",  fontWeight: "700" }],
        "display-sm": ["var(--text-display-sm)", { lineHeight: "1.2",  fontWeight: "700" }],
        "body-lg":    ["1.125rem", { lineHeight: "1.6",  fontWeight: "400" }],
        body:         ["1rem",     { lineHeight: "1.65", fontWeight: "400" }],
        "body-sm":    ["0.875rem", { lineHeight: "1.5",  fontWeight: "500" }],
      },

      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        DEFAULT: "var(--radius-md)",
      },

      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        DEFAULT: "var(--shadow-md)",
      },

      borderWidth: {
        DEFAULT: "1px",
        "1.5": "1.5px",
      },

      ringWidth: {
        DEFAULT: "3px",
      },

      ringColor: {
        DEFAULT: "rgba(111, 174, 133, 0.5)", // primary-300 @ 50 %
      },

      transitionDuration: {
        DEFAULT: "150ms",
      },

      maxWidth: {
        container: "var(--container-max)",
      },

      spacing: {
        "container-x": "var(--container-padding)",
        "safe-top":    "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};

export default config;
