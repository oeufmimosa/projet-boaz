import { ChatOption } from "@/types/chatbox";

export function ChatOptions({
  options,
  onPick,
}: {
  options: ChatOption[];
  onPick: (o: ChatOption) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onPick(o)}
          className="min-h-11 w-full rounded-md border-1.5 border-primary-200 bg-primary-50 px-4 py-2.5 text-left text-body font-medium text-primary-700 transition-colors hover:bg-primary-100 sm:w-auto"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
