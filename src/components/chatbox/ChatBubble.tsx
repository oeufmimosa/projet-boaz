import { Fragment } from "react";
import { cn } from "@/components/ui/cn";
import { ChatAvatar } from "./ChatAvatar";

interface Props {
  role: "bot" | "user";
  text: string;
  ts: number;
  initials?: string;
  liveAnnounce?: boolean;
}

/**
 * Rend `**texte**` comme <strong>. Mini-parser sécurisé (pas de
 * dangerouslySetInnerHTML) : on alterne segments plain / segments en gras.
 * Bot uniquement ; les bulles user restent brutes.
 */
function renderInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) return <strong key={i} className="font-semibold">{m[1]}</strong>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function ChatBubble({ role, text, ts, initials, liveAnnounce }: Props) {
  const time = new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const isBot = role === "bot";

  return (
    <div
      aria-live={liveAnnounce && isBot ? "polite" : undefined}
      className={cn("flex gap-2", isBot ? "justify-start" : "justify-end")}
    >
      {isBot && initials && <ChatAvatar initials={initials} size={28} variant="light" className="mt-0.5" />}
      <div className={cn("flex max-w-[80%] flex-col", isBot ? "items-start" : "items-end")}>
        <div
          className={cn(
            "rounded-lg px-4 py-3 text-body whitespace-pre-line",
            isBot
              ? "bg-surface-2 text-text rounded-bl-sm"
              : "bg-primary-500 text-text-inverse rounded-br-sm",
          )}
        >
          {isBot ? renderInlineMarkdown(text) : text}
        </div>
        <p className="mt-1 text-body-sm text-text-muted">{time}</p>
      </div>
    </div>
  );
}
