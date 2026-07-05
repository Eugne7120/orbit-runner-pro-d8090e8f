import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  MessageSquare,
  LayoutDashboard,
  CreditCard,
  Code2,
  Server,
  Coins,
  Brain,
  Settings,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
  comingSoon?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", icon: Home, to: "/app" },
  { label: "Chat", icon: MessageSquare, to: "/app/chat" },
  { label: "Dashboard", icon: LayoutDashboard, to: "/app/dashboard" },
  { label: "Credits", icon: CreditCard, to: "/app/credits" },
];

const COMING_SOON_ITEMS: NavItem[] = [
  { label: "API", icon: Code2, to: "/app/api", comingSoon: true },
  { label: "Workers", icon: Server, to: "/app/workers", comingSoon: true },
  { label: "Staking", icon: Coins, to: "/app/staking", comingSoon: true },
  { label: "Workspace", icon: Brain, to: "/app/workspace", comingSoon: true },
];

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const router = useRouterState();
  const isActive = router.location.pathname === item.to ||
    (item.to !== "/app" && router.location.pathname.startsWith(item.to));

  if (item.comingSoon) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground/40 cursor-not-allowed select-none">
        <item.icon className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-medium flex-1">{item.label}</span>
        <span className="text-[10px] font-mono tracking-widest text-muted-foreground/30 uppercase">Soon</span>
      </div>
    );
  }

  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-lg bg-white/[0.07] border border-white/[0.09]"
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        />
      )}
      <item.icon className={cn("w-4 h-4 flex-shrink-0 relative z-10", isActive && "text-signal")} />
      <span className="text-sm font-medium relative z-10 flex-1">{item.label}</span>
      {isActive && (
        <div className="w-1 h-1 rounded-full bg-signal relative z-10" />
      )}
    </Link>
  );
}

function Divider() {
  return <div className="my-2 h-px bg-border" />;
}

interface AppSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AppSidebar({ mobileOpen, onMobileClose }: AppSidebarProps) {
  const router = useRouterState();
  const isSettingsActive = router.location.pathname === "/app/settings";

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5">
        <Link to="/app" className="flex items-center gap-2.5 group" onClick={onMobileClose}>
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 rounded-full bg-signal/20 group-hover:bg-signal/30 transition-colors" />
            <div className="absolute inset-1 rounded-full bg-signal/60" />
            <div className="absolute inset-2 rounded-full bg-background" />
            <Zap className="absolute inset-0 m-auto w-3 h-3 text-signal" />
          </div>
          <span className="text-sm font-semibold tracking-wider text-foreground">0RBIT</span>
        </Link>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} item={item} onClick={onMobileClose} />
        ))}

        <Divider />

        {COMING_SOON_ITEMS.map((item) => (
          <NavLink key={item.to} item={item} />
        ))}
      </nav>

      {/* Bottom: Settings */}
      <div className="px-2 pb-4 pt-2 border-t border-border mt-2">
        <Link
          to="/app/settings"
          onClick={onMobileClose}
          className={cn(
            "relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
            isSettingsActive
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
          )}
        >
          {isSettingsActive && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-0 rounded-lg bg-white/[0.07] border border-white/[0.09]"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <Settings className={cn("w-4 h-4 flex-shrink-0 relative z-10", isSettingsActive && "text-signal")} />
          <span className="text-sm font-medium relative z-10">Settings</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-sidebar border-r border-border flex-shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-border z-50 flex flex-col"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
