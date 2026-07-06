import { useState, useRef } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Search,
  MessageSquare,
  LayoutDashboard,
  Code2,
  Server,
  Coins,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Trash2,
  Pin,
  Edit2,
  Check,
  X,
  LogOut,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useGuestMode, exitGuestMode } from "@/lib/guest";
import type { Conversation } from "@/lib/chat-store";
import orbitLogoIcon from "@/assets/orbit-logo-icon.png";

// ─── Conversation item ────────────────────────────────────────────────────────

function ConvItem({
  conv,
  isActive,
  onDelete,
  onRename,
  onPin,
  onNavigate,
}: {
  conv: Conversation;
  isActive: boolean;
  onDelete: () => void;
  onRename: (t: string) => void;
  onPin: () => void;
  onNavigate?: () => void;
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
      onClick={onNavigate}
      className={cn(
        "group relative flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all duration-150 border border-transparent",
        isActive
          ? "bg-white/[0.08] text-foreground border-white/[0.06]"
          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
      )}
    >
      {conv.pinned && <Pin className="w-3 h-3 text-signal fill-signal/20 flex-shrink-0" />}
      {editing ? (
        <input
          ref={inputRef}
          value={editVal}
          onChange={(e) => setEditVal(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") setEditing(false);
          }}
          onClick={(e) => e.preventDefault()}
          className="flex-1 bg-transparent text-xs text-foreground outline-none border-b border-signal/50 min-w-0"
        />
      ) : (
        <span className="flex-1 text-xs font-medium truncate">{conv.title}</span>
      )}

      <div
        className={cn(
          "flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0",
          editing && "hidden",
          isActive && "opacity-100",
        )}
      >
        <button
          onClick={(e) => { e.preventDefault(); startEdit(); }}
          className="p-0.5 rounded hover:bg-white/[0.1] text-muted-foreground/50 hover:text-foreground"
        >
          <Edit2 className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); onPin(); }}
          className="p-0.5 rounded hover:bg-white/[0.1] text-muted-foreground/50 hover:text-foreground"
        >
          <Pin className={cn("w-3 h-3", conv.pinned && "text-signal")} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); onDelete(); }}
          className="p-0.5 rounded hover:bg-white/[0.1] text-muted-foreground/50 hover:text-destructive"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </Link>
  );
}

// ─── Main sidebar ─────────────────────────────────────────────────────────────

interface ChatSidebarProps {
  conversations: Conversation[];
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onPin: (id: string) => void;
  onRefresh: () => void;
}

function SidebarContent({
  conversations,
  onMobileClose,
  onNew,
  onDelete,
  onRename,
  onPin,
  onRefresh,
  collapsed,
  onToggleCollapse,
}: ChatSidebarProps & { collapsed: boolean; onToggleCollapse: () => void }) {
  const router = useRouterState();
  const navigate = useNavigate();
  const { logout, user } = usePrivy();
  const { wallets } = useWallets();
  const guest = useGuestMode();
  const pathname = router.location.pathname;

  const activeConvId = pathname.startsWith("/app/chat/")
    ? pathname.split("/app/chat/")[1]
    : undefined;

  const walletAddress = wallets[0]?.address;
  const displayName = guest
    ? "Guest"
    : (user?.twitter?.name ?? user?.google?.name ?? (walletAddress ? `${walletAddress.slice(0, 4)}…${walletAddress.slice(-4)}` : "User"));
  const avatarUrl = user?.twitter?.profilePictureUrl;
  const avatarLetter = displayName[0]?.toUpperCase() ?? "U";

  const handleLogout = () => {
    onMobileClose?.();
    exitGuestMode();
    if (guest) navigate({ to: "/app/login" });
    else logout().then(() => navigate({ to: "/app/login" }));
  };

  const NAV = [
    { label: "Chat", icon: MessageSquare, to: "/app/chat", exact: false },
    { label: "Dashboard", icon: LayoutDashboard, to: "/app/dashboard", exact: true },
  ];
  const SOON = [
    { label: "API", icon: Code2 },
    { label: "Workers", icon: Server },
    { label: "Staking", icon: Coins },
  ];

  return (
    <div className="flex flex-col h-full select-none">
      {/* ── Top: logo + toggle ── */}
      <div className="flex items-center justify-between px-3 py-4 flex-shrink-0">
        <Link
          to="/app"
          onClick={onMobileClose}
          className="flex items-center gap-2.5 group"
        >
          <div className="relative w-6 h-6 flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-signal/20 group-hover:bg-signal/30 transition-colors" />
            <div className="absolute inset-[3px] rounded-full bg-signal/60" />
            <div className="absolute inset-[5px] rounded-full bg-background" />
            <img src={orbitLogoIcon} alt="0RBIT" className="absolute inset-0 m-auto w-2.5 h-2.5 object-contain" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-wider text-foreground">0RBIT</span>
          )}
        </Link>

        <button
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors hidden lg:flex"
        >
          {collapsed
            ? <PanelLeftOpen className="w-4 h-4" />
            : <PanelLeftClose className="w-4 h-4" />
          }
        </button>
        {onMobileClose && (
          <button onClick={onMobileClose} className="lg:hidden p-1 rounded text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Primary nav ── */}
      <nav className="px-2 space-y-0.5 flex-shrink-0">
        {/* Search */}
        <button className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors text-sm",
          collapsed && "justify-center",
        )}>
          <Search className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Search</span>}
        </button>

        {NAV.map(({ label, icon: Icon, to, exact }) => {
          const isActive = exact ? pathname === to : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={onMobileClose}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150",
                collapsed && "justify-center",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="chat-sidebar-active"
                  className="absolute inset-0 rounded-lg bg-white/[0.07] border border-white/[0.09]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                />
              )}
              <Icon className={cn("w-4 h-4 flex-shrink-0 relative z-10", isActive && "text-signal")} />
              {!collapsed && <span className="text-sm font-medium relative z-10">{label}</span>}
            </Link>
          );
        })}

        <div className="my-1.5 h-px bg-border mx-1" />

        {SOON.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground/35 cursor-not-allowed",
              collapsed && "justify-center",
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="text-sm font-medium flex-1">{label}</span>
                <span className="text-[10px] text-muted-foreground/30 uppercase tracking-widest">Soon</span>
              </>
            )}
          </div>
        ))}
      </nav>

      {/* ── Chats section ── */}
      {!collapsed && (
        <div className="flex flex-col flex-1 overflow-hidden mt-3 border-t border-border">
          <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0">
            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
              Chats
            </span>
            <button
              onClick={() => { onNew(); onMobileClose?.(); }}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-muted-foreground/60 hover:text-signal hover:bg-signal/10 transition-colors text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-0.5 pb-2">
            {conversations.length === 0 ? (
              <p className="px-3 py-3 text-[11px] text-muted-foreground/40 text-center">
                No conversations yet
              </p>
            ) : (
              conversations.map((conv) => (
                <ConvItem
                  key={conv.id}
                  conv={conv}
                  isActive={conv.id === activeConvId}
                  onNavigate={onMobileClose}
                  onDelete={() => { onDelete(conv.id); onRefresh(); }}
                  onRename={(t) => { onRename(conv.id, t); onRefresh(); }}
                  onPin={() => { onPin(conv.id); onRefresh(); }}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* ── User profile ── */}
      <div className={cn("px-2 pb-3 pt-2 border-t border-border flex-shrink-0 mt-auto", collapsed && "flex justify-center")}>
        {collapsed ? (
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors">
            <div className="w-6 h-6 rounded-full bg-signal/20 border border-signal/30 flex items-center justify-center overflow-hidden">
              {avatarUrl
                ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                : <span className="text-[10px] font-semibold text-signal">{avatarLetter}</span>
              }
            </div>
          </button>
        ) : (
          <div className="group relative flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-signal/20 border border-signal/30 flex items-center justify-center overflow-hidden flex-shrink-0">
              {avatarUrl
                ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                : <span className="text-xs font-semibold text-signal">{avatarLetter}</span>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{displayName}</p>
              {walletAddress && (
                <p className="text-[10px] text-muted-foreground font-mono truncate">
                  <Wallet className="w-2.5 h-2.5 inline mr-1" />
                  {`${walletAddress.slice(0, 4)}…${walletAddress.slice(-4)}`}
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-white/[0.05] transition-all"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatSidebar(props: ChatSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-sidebar border-r border-border flex-shrink-0 h-screen sticky top-0 transition-all duration-200",
          collapsed ? "w-14" : "w-56",
        )}
      >
        <SidebarContent
          {...props}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {props.mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              onClick={props.onMobileClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.28 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-border z-50 flex flex-col"
            >
              <SidebarContent
                {...props}
                collapsed={false}
                onToggleCollapse={() => {}}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
