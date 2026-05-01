import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { FloatingSimCTA } from "@/components/layout/FloatingSimCTA";
import { ChatLauncher } from "@/components/chatbox/ChatLauncher";
import { loadChatConfig } from "@/lib/chatbox-config";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const chatConfig = await loadChatConfig();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
      <StickyMobileCTA />
      <FloatingSimCTA />
      <ChatLauncher config={chatConfig} />
    </div>
  );
}
