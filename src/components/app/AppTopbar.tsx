import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Menu, Search, LogOut, User, Wallet } from "lucide-react";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useGuestMode, exitGuestMode } from "@/lib/guest";

function shortenAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

function getPageTitle(pathname: string) {
  const map: Record<string, string> = {
    "/app": "Home",
    "/app/chat": "Chat",
    "/app/dashboard": "Dashboard",
    "/app/credits": "Credits",
    "/app/settings": "Settings",
    "/app/api": "API",
    "/app/workers": "Workers",
    "/app/staking": "Staking",
    "/app/workspace": "Workspace",
  };
  return map[pathname] ?? "0RBIT";
}

interface AppTopbarProps {
  onMenuOpen: () => void;
}

export function AppTopbar({ onMenuOpen }: AppTopbarProps) {
  const { logout, user } = usePrivy();
  const { wallets } = useWallets();
  const guest = useGuestMode();
  const navigate = useNavigate();
  const router = useRouterState();
  const pathname = router.location.pathname;
  const title = getPageTitle(pathname);

  const connectedWallet = wallets[0];
  const walletAddress = connectedWallet?.address;

  const displayName = guest
    ? "Guest"
    : (user?.twitter?.name ??
      user?.google?.name ??
      (walletAddress ? shortenAddress(walletAddress) : "User"));

  const handleLogout = () => {
    exitGuestMode();
    if (guest) navigate({ to: "/app/login" });
    else logout().then(() => navigate({ to: "/app/login" }));
  };

  const avatarLetter = displayName[0]?.toUpperCase() ?? "U";
  const avatarUrl = user?.twitter?.profilePictureUrl;

  return (
    <header className="sticky top-0 z-30 flex items-center h-14 px-4 border-b border-border bg-background/80 backdrop-blur-md gap-3">
      {/* Mobile menu button */}
      <button
        onClick={onMenuOpen}
        aria-label="Open menu"
        className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors flex-shrink-0"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Page title */}
      <h1 className="text-sm font-semibold text-foreground flex-1 truncate">{title}</h1>

      {/* Search placeholder */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-border text-muted-foreground/60 text-xs cursor-pointer hover:bg-white/[0.07] transition-colors min-w-32">
        <Search className="w-3 h-3 flex-shrink-0" />
        <span>Search...</span>
        <kbd className="ml-auto font-mono text-[10px] px-1 py-0.5 rounded bg-white/[0.06] text-muted-foreground/50">
          ⌘K
        </kbd>
      </div>

      {/* Credits badge */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-signal/10 border border-signal/20 text-signal text-xs font-medium">
        <div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
        <span>120 Credits</span>
      </div>

      {/* Wallet status */}
      {walletAddress && (
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-border text-xs text-muted-foreground font-mono">
          <Wallet className="w-3 h-3 text-signal" />
          <span>{shortenAddress(walletAddress)}</span>
        </div>
      )}

      {/* User avatar + logout */}
      <div className="relative group">
        <button
          aria-label="User menu"
          className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-signal/20 border border-signal/30 flex items-center justify-center overflow-hidden flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-semibold text-signal">{avatarLetter}</span>
            )}
          </div>
          <span className="hidden sm:block text-xs text-muted-foreground max-w-24 truncate">
            {displayName}
          </span>
        </button>

        {/* Dropdown */}
        <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-popover border border-border shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 py-1 z-50">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs font-medium text-foreground truncate">{displayName}</p>
            {walletAddress && (
              <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">
                {shortenAddress(walletAddress)}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-destructive hover:bg-white/[0.04] transition-colors"
          >
            <LogOut className="w-3 h-3" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
