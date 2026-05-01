import { ChatAvatar } from "./ChatAvatar";

export function ChatTypingIndicator({ initials }: { initials: string }) {
  return (
    <div className="flex gap-2" aria-label="Le conseiller écrit">
      <ChatAvatar initials={initials} size={28} variant="light" className="mt-0.5" />
      <div className="rounded-lg rounded-bl-sm bg-surface-2 px-4 py-3 text-text">
        <span className="flex items-center gap-1">
          <Dot delay={0} />
          <Dot delay={150} />
          <Dot delay={300} />
        </span>
      </div>
      <style>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: .4; }
          30% { transform: translateY(-3px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .typing-dot { animation: none !important; opacity: .6; }
        }
      `}</style>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="typing-dot inline-block h-2 w-2 rounded-full bg-primary-500"
      style={{ animation: `typing 1s infinite ease-in-out`, animationDelay: `${delay}ms` }}
      aria-hidden
    />
  );
}
