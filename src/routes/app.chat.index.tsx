import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatDemo } from "@/components/chat/ChatDemo";
import { chatStore } from "@/lib/chat-store";
import type { OrbitModelId } from "@/lib/openai";
import { motion, AnimatePresence } from "motion/react";

export const Route = createFileRoute("/app/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  const [model, setModel] = useState<OrbitModelId>("0rbit-core");
  const [input, setInput] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = () => {
    if (!input.trim()) return;
    const prompt = input.trim();
    const conv = chatStore.create(model);
    setInput("");
    navigate({ to: "/app/chat/$id", params: { id: conv.id }, search: { q: prompt } });
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {!showDemo ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <ChatEmptyState
                model={model}
                onModelChange={setModel}
                onPrompt={(p) => {
                  setInput(p);
                }}
                onStartDemo={() => setShowDemo(true)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="demo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 200 }}
              className="h-full p-4 md:p-8 flex flex-col items-center justify-center max-w-4xl mx-auto w-full"
            >
              <ChatDemo onClose={() => setShowDemo(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!showDemo && (
        <div className="p-4 border-t border-border bg-background/50 backdrop-blur-md">
          <div className="max-w-3xl mx-auto">
            <ChatComposer
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isEmpty={true}
              model={model}
            />
          </div>
        </div>
      )}
    </div>
  );
}
