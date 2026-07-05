import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Wallet, Twitter, Mail, Calendar, Shield } from "lucide-react";
import { motion } from "motion/react";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function UserProfile() {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];

  const displayName =
    user?.twitter?.name ??
    user?.google?.name ??
    (wallet?.address ? shortenAddress(wallet.address) : "Anonymous");

  const avatarUrl = user?.twitter?.profilePictureUrl ?? user?.google?.picture;
  const avatarLetter = displayName[0]?.toUpperCase() ?? "U";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "July 2025";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-border bg-surface p-5"
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full bg-signal/20 border border-signal/30 flex items-center justify-center overflow-hidden flex-shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-semibold text-signal">{avatarLetter}</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-foreground truncate">{displayName}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">0RBIT Member</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3">
        {wallet?.address && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center flex-shrink-0">
              <Wallet className="w-3.5 h-3.5 text-signal" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Wallet</p>
              <p className="text-xs text-foreground font-mono truncate">{shortenAddress(wallet.address)}</p>
            </div>
          </div>
        )}
        {user?.twitter && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center flex-shrink-0">
              <Twitter className="w-3.5 h-3.5 text-signal" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">X (Twitter)</p>
              <p className="text-xs text-foreground truncate">@{user.twitter.username}</p>
            </div>
          </div>
        )}
        {user?.google && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center flex-shrink-0">
              <Mail className="w-3.5 h-3.5 text-signal" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Google</p>
              <p className="text-xs text-foreground truncate">{user.google.email}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center flex-shrink-0">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Member since</p>
            <p className="text-xs text-foreground">{memberSince}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center flex-shrink-0">
            <Shield className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Security</p>
            <p className="text-xs text-foreground">Privy authenticated</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
