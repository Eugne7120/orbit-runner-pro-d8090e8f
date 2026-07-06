import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState, useCallback } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { chatStore, type Conversation } from "@/lib/chat-store";
import { useGuestMode } from "@/lib/guest";
import { motion, AnimatePresence } from "motion/react";
import { Atmosphere } from "@/components/orbit/Atmosphere";
import { Menu } from "lucide-react";
import { ChatRefreshContext } from "@/lib/chat-context";

export const Route = createFileRoute("/app/chat")({
  component: ChatLayout,
});

function ChatLayout() {
  const { authenticated, ready } = usePrivy();
  const guest = useGuestMode();
  const navigate = useNavigate();
  const router = useRouterState();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const refresh = useCallback(() => setConversations(chatStore.getAll()), []);

  useEffect(() => {
    if (ready && !authenticated && !guest) navigate({ to: "/app/login" });
  }, [ready, authenticated, guest]);

  useEffect(() => {
    if (guest && !sessionStorage.getItem("orbit_guest_session")) {
      chatStore.clearAll();
      sessionStorage.setItem("orbit_guest_session", "1");
    }
    refresh();
  }, []);

  if (!ready || (!authenticated && !guest)) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <Atmosphere />
      <div className="absolute inset-0 bg-background/50 pointer-events-none" />

      <ChatSidebar
        conversations={conversations}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onNew={() => {
          const c = chatStore.create();
          refresh();
          navigate({ to: "/app/chat/$id", params: { id: c.id } });
        }}
        onDelete={(id) => {
          chatStore.delete(id);
          refresh();
          navigate({ to: "/app/chat" });
        }}
        onRename={(id, t) => { chatStore.rename(id, t); refresh(); }}
        onPin={(id) => { chatStore.togglePin(id); refresh(); }}
        onRefresh={refresh}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-md flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-foreground">0RBIT</span>
        </div>

        <ChatRefreshContext.Provider value={refresh}>
          <AnimatePresence mode="wait">
            <motion.div
              key={router.location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col min-w-0 overflow-hidden"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </ChatRefreshContext.Provider>
      </div>
    </div>
  );
}
