import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState, useCallback } from "react";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { chatStore, type Conversation } from "@/lib/chat-store";
import { useGuestMode } from "@/lib/guest";

export const Route = createFileRoute("/app/chat")({
  component: ChatLayout,
});

function ChatLayout() {
  const { authenticated, ready } = usePrivy();
  const guest = useGuestMode();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const refresh = useCallback(() => setConversations(chatStore.getAll()), []);

  useEffect(() => {
    if (ready && !authenticated && !guest) navigate({ to: "/app/login" });
  }, [ready, authenticated, guest]);

  useEffect(() => {
    refresh();
  }, []);

  if (!ready || (!authenticated && !guest)) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AppTopbar onMenuOpen={() => setMobileOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
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
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
