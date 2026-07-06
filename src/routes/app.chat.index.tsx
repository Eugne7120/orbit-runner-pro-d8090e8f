import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import { chatStore } from "@/lib/chat-store";
import type { OrbitModelId } from "@/lib/openai";
import { useChatRefresh } from "@/lib/chat-context";

export const Route = createFileRoute("/app/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  const refresh = useChatRefresh();
  const [model, setModel] = useState<OrbitModelId>("0rbit-core");
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;
    const prompt = input.trim();
    const conv = chatStore.create(model);
    setInput("");
    refresh();
    navigate({ to: "/app/chat/$id", params: { id: conv.id }, search: { q: prompt } });
  };

  const handlePrompt = (p: string) => {
    const conv = chatStore.create(model);
    refresh();
    navigate({ to: "/app/chat/$id", params: { id: conv.id }, search: { q: p } });
  };

  return (
    <ChatEmptyState
      model={model}
      onModelChange={setModel}
      value={input}
      onChange={setInput}
      onSubmit={handleSubmit}
      onPrompt={handlePrompt}
    />
  );
}
