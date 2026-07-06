import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState, useCallback } from "react";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { chatStore, type Conversation } from "@/lib/chat-store";
import { useGuestMode } from "@/lib/guest";
import { motion, AnimatePresence } from "motion/react";
import { Atmosphere } from "@/components/orbit/Atmosphere";

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
    // Guests get a clean slate on every new page load / tab open.
    // sessionStorage is automatically wiped when the tab closes, so
    // the next visit will always start fresh.
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
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] pointer-events-none" />

      <AppSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        <AppTopbar onMenuOpen={() => setMobileOpen(true)} />
        <div className="flex flex-1 overflow-hidden relative">
          <ConversationSidebar
            conversations={conversations}
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
            onRename={(id, t) => {
              chatStore.rename(id, t);
              refresh();
            }}
            onPin={(id) => {
              chatStore.togglePin(id);
              refresh();
            }}
            onRefresh={refresh}
          />
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={router.location.pathname}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex-1 flex flex-col min-w-0 overflow-hidden"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
