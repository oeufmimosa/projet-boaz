"use client";

import { Container } from "@/components/ui/Container";
import { ChatAvatar } from "@/components/chatbox/ChatAvatar";

/**
 * Bloc encart "Pas sûr de votre projet ? Discutons-en." dans la home mobile.
 * Le clic émet un CustomEvent('chatbox:open') que le ChatLauncher écoute pour
 * ouvrir directement le panneau, évitant un couplage direct entre les deux.
 */
export function ChatHomeInvite({
  advisorName,
  advisorInitials,
}: {
  advisorName: string;
  advisorInitials: string;
}) {
  const open = () => window.dispatchEvent(new CustomEvent("chatbox:open"));
  return (
    <section className="bg-surface-2 py-8">
      <Container>
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-start gap-4">
            <ChatAvatar initials={advisorInitials} size={40} variant="light" />
            <div>
              <p className="font-display text-display-sm">Pas sûr de votre projet ?</p>
              <p className="mt-1 text-body text-text-muted">
                Discutons-en. {advisorName.split("—")[0].trim()} vous oriente en quelques questions.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={open}
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-md bg-primary-700 px-4 font-display font-semibold text-text-inverse hover:bg-primary-800"
          >
            Démarrer la discussion
          </button>
        </div>
      </Container>
    </section>
  );
}
