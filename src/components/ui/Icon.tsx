/**
 * Icônes SVG centralisées (style Lucide, ligne 1.8px). Remplacent les emojis
 * disséminés dans l'app pour un rendu plus net, pro et personnalisable.
 *
 * Usage :
 *   <Icon name="flame" className="h-6 w-6 text-primary-700" />
 *
 * Pour ajouter une icône : ajoute un nom à `IconName` et le path dans `ICONS`.
 */

export type IconName =
  | "search"
  | "gear"
  | "wrench"
  | "refresh"
  | "flame"
  | "snowflake"
  | "brick"
  | "tank"
  | "sun"
  | "drop"
  | "house"
  | "clipboard"
  | "wave"
  | "coin"
  | "lock";

const ICONS: Record<IconName, React.ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </>
  ),
  flame: (
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.5 0 2.5-1 2.5-2.5 0-1-.5-2-1.5-3a5.5 5.5 0 0 1-1.5-3.5C10 6 12 4 14 4c1 0 2 .5 2.5 1.5 0 0-1 0-1.5.5C14 7 14 9 15.5 10.5c1.5 1.5 2.5 3.5 2.5 5.5a6 6 0 1 1-12 0c0-2 1-4 2.5-5a3 3 0 0 1 0 3.5z" />
  ),
  snowflake: (
    <>
      <path d="M12 2v20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07M2 12h20" />
      <path d="m9 5 3-3 3 3M15 19l-3 3-3-3M5 9 2 12l3 3M19 15l3-3-3-3" />
    </>
  ),
  brick: (
    <>
      <path d="M3 5h18v4H3zM3 9v4M9 9v4M15 9v4M21 9v4M3 13h18v4H3zM7 17v4M13 17v4M19 17v4M3 13v8h18v-8" />
      <path d="M3 5v0M21 5v0" />
    </>
  ),
  tank: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M6 8h12M9 14h.01M14 14h.01" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  drop: (
    <path d="M12 2.5s6 6 6 11a6 6 0 1 1-12 0c0-5 6-11 6-11z" />
  ),
  house: (
    <>
      <path d="M3 12 12 3l9 9" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
  clipboard: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 12h6M9 16h6" />
    </>
  ),
  wave: (
    <>
      <path d="M7 11.5V14a5 5 0 0 0 10 0V8a2 2 0 1 0-4 0v3" />
      <path d="M13 9V5a2 2 0 1 0-4 0v8" />
      <path d="M9 13V8.5a2 2 0 1 0-4 0V14a8 8 0 0 0 16 0v-3" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
};

export function Icon({
  name,
  className = "h-6 w-6",
  strokeWidth = 1.8,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {ICONS[name]}
    </svg>
  );
}
