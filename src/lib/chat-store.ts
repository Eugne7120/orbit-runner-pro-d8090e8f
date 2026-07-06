export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  model: string;
  pinned?: boolean;
}

const STORAGE_KEY = "orbit_conversations";

function load(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<
      Omit<Conversation, "createdAt" | "messages"> & {
        createdAt: string;
        messages: Array<Omit<Message, "createdAt"> & { createdAt: string }>;
      }
    >;
    return parsed.map((c) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      messages: c.messages.map((m) => ({ ...m, createdAt: new Date(m.createdAt) })),
    }));
  } catch {
    return [];
  }
}

function save(conversations: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export const chatStore = {
  getAll(): Conversation[] {
    return load().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  get(id: string): Conversation | undefined {
    return load().find((c) => c.id === id);
  },

  create(model = "0rbit-core"): Conversation {
    const conv: Conversation = {
      id: crypto.randomUUID(),
      title: "New chat",
      messages: [],
      createdAt: new Date(),
      model,
    };
    const all = load();
    save([conv, ...all]);
    return conv;
  },

  rename(id: string, title: string) {
    const all = load().map((c) => (c.id === id ? { ...c, title } : c));
    save(all);
  },

  delete(id: string) {
    save(load().filter((c) => c.id !== id));
  },

  togglePin(id: string) {
    const all = load().map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c));
    save(all);
  },

  addMessage(conversationId: string, msg: Omit<Message, "id" | "createdAt">): Message {
    const message: Message = { ...msg, id: crypto.randomUUID(), createdAt: new Date() };
    const all = load().map((c) => {
      if (c.id !== conversationId) return c;
      const title =
        c.messages.length === 0 && msg.role === "user" ? msg.content.slice(0, 50) : c.title;
      return { ...c, title, messages: [...c.messages, message] };
    });
    save(all);
    return message;
  },

  updateLastMessage(conversationId: string, content: string) {
    const all = load().map((c) => {
      if (c.id !== conversationId) return c;
      const messages = [...c.messages];
      if (messages.length > 0)
        messages[messages.length - 1] = { ...messages[messages.length - 1], content };
      return { ...c, messages };
    });
    save(all);
  },

  setModel(id: string, model: string) {
    const all = load().map((c) => (c.id === id ? { ...c, model } : c));
    save(all);
  },

  clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  },
};
