import { useState, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, Search, Trash2, Pin, Edit2, Check, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/chat-store";
import { chatStore } from "@/lib/chat-store";

function groupConversations(convs: Conversation[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const week = new Date(today.getTime() - 7 * 86400000);

  const groups: Record<string, Conversation[]> = {
    Pinned: [],
    Today: [],
    Yesterday: [],
    "Previous 7 days": [],
    Older: [],
  };

  for (const c of convs) {
    if (c.pinned) { groups.Pinned.push(c); continue; }
    const d = new Date(c.createdAt);
    if (d >= today) groups.Today.push(c);
    else if (d >= yesterday) groups.Yesterday.push(c);
    else if (d >= week) groups["Previous 7 days"].push(c);
    else groups.Older.push(c);
  }

  return groups;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId?: string;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onPin: (id: string) => void;
  onRefresh: () => void;
}

function ConvItem({
  conv,
  isActive,
  onDelete,
  onRename,
  onPin,
}: {
  conv: Conversation;
  isActive: boolean;
  onDelete: () => void;
  onRename: (title: string) => void;
  onPin: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(conv.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setEditVal(conv.title);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };
  const commitEdit = () => {
    if (editVal.trim()) onRename(editVal.trim());
    setEditing(false);
  };

  return (
    <Link
      to="/app/chat/$id"
      params={{ id: conv.id }}
      className={cn(
        "group relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
        isActive ? "bg-white/[0.08] text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
      )}
    >
      {conv.pinned && <Pin className="w-3 h-3 text-signal flex-shrink-0" />}
      {editing ? (
        <input
          ref={inputRef}
          value={editVal}
          onChange={(e) => setEditVal(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(false); }}
          onClick={(e) => e.preventDefault()}
          className="flex-1 bg-transparent text-xs text-foreground outline-none border-b border-signal/50"
        />
      ) : (
        <span className="flex-1 text-xs truncate">{conv.title}</span>
      )}

      {/* Hover actions */}
      <div className={cn("flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity", editing && "hidden")}>
        <button onClick={(e) => { e.preventDefault(); startEdit(); }} className="p-1 rounded hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition-colors">
          <Edit2 className="w-2.5 h-2.5" />
        </button>
        <button onClick={(e) => { e.preventDefault(); onPin(); }} className="p-1 rounded hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition-colors">
          <Pin className={cn("w-2.5 h-2.5", conv.pinned && "text-signal")} />
        </button>
        <button onClick={(e) => { e.preventDefault(); onDelete(); }} className="p-1 rounded hover:bg-white/[0.08] text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-2.5 h-2.5" />
        </button>
      </div>
    </Link>
  );
}

export function ConversationSidebar({
  conversations,
  activeId,
  onNew,
  onDelete,
  onRename,
  onPin,
  onRefresh,
}: ConversationSidebarProps) {
  const [search, setSearch] = useState("");
  const filtered = search
    ? conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
    : conversations;
  const groups = groupConversations(filtered);

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col h-full bg-sidebar border-r border-border">
      {/* Header */}
      <div className="px-3 py-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-signal" />
          <span className="text-xs font-semibold text-foreground">Chats</span>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-signal/15 text-signal hover:bg-signal/25 transition-colors text-xs font-medium"
        >
          <Plus className="w-3 h-3" />
          New
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-border">
          <Search className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {Object.entries(groups).map(([label, convs]) => {
          if (!convs.length) return null;
          return (
            <div key={label}>
              <p className="px-2 py-1 text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">{label}</p>
              {convs.map((conv) => (
                <ConvItem
                  key={conv.id}
                  conv={conv}
                  isActive={conv.id === activeId}
                  onDelete={() => { onDelete(conv.id); onRefresh(); }}
                  onRename={(t) => { onRename(conv.id, t); onRefresh(); }}
                  onPin={() => { onPin(conv.id); onRefresh(); }}
                />
              ))}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-3 py-4 text-xs text-muted-foreground/50 text-center">No conversations</p>
        )}
      </div>
    </aside>
  );
}
