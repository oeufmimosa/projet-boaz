/**
 * Sous-titre d'étape (question secondaire). Body-lg, neutre, alignement
 * paramétrable selon le nombre d'options.
 */
export function StepSubheading({
  text,
  centered = false,
  helpTooltip,
}: {
  text: string;
  centered?: boolean;
  helpTooltip?: string;
}) {
  return (
    <p className={`text-body-lg text-text ${centered ? "text-center" : ""}`}>
      {text}
      {helpTooltip && (
        <button
          type="button"
          aria-label="Aide"
          title={helpTooltip}
          className="ml-2 inline-flex h-5 w-5 -translate-y-0.5 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-[11px] font-bold align-middle hover:bg-primary-200"
        >
          i
        </button>
      )}
    </p>
  );
}
