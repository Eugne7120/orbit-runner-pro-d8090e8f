import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { chatStore } from "@/lib/chat-store";
import type { OrbitModelId } from "@/lib/openai";

export const Route = createFileRoute("/app/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  const [model, setModel] = useState<OrbitModelId>("0rbit-core");
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;
    const prompt = input.trim();
    const conv = chatStore.create(model);
    setInput("");
    navigate({ to: "/app/chat/$id", params: { id: conv.id }, search: { q: prompt } });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ChatEmptyState
          model={model}
          onModelChange={setModel}
          onPrompt={(p) => {
            setInput(p);
          }}
        />
      </div>
      <div className="p-4 border-t border-border">
        <ChatComposer
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          isEmpty={true}
          model={model}
        />
      </div>
    </div>
  );
}
