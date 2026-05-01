import { ChatAvatar } from "./ChatAvatar";
import { TricolorBar } from "@/components/brand/TricolorBar";

export function ChatHeader({
  name,
  initials,
  onClose,
  titleId,
}: {
  name: string;
  initials: string;
  onClose: () => void;
  titleId: string;
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-3 bg-primary-700 px-4 py-3 text-text-inverse h-16">
        <div className="flex items-center gap-3 min-w-0">
          <ChatAvatar initials={initials} size={36} variant="light" />
          <div className="min-w-0">
            <p id={titleId} className="font-display text-body font-semibold truncate">{name}</p>
            <p className="flex items-center gap-1.5 text-body-sm text-primary-200">
              <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-success" />
              En ligne
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la chatbox"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md hover:bg-primary-800"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
      <TricolorBar />
    </>
  );
}
