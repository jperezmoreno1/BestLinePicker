"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut, ShieldAlert } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function UserMenu() {
  const { user, signOut, openAuthModal } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!user) return null;

  const label = user.displayName?.split(" ")[0] || user.email?.split("@")[0] || "Account";
  const initial = label.trim().charAt(0).toUpperCase();

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 rounded-xl border border-border bg-muted px-2 py-1.5 transition hover:bg-secondary/40"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            className="h-7 w-7 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground">
            {initial}
          </span>
        )}

        <span className="hidden max-w-[120px] truncate text-sm font-bold text-foreground md:inline">
          {label}
        </span>

        {!user.emailVerified && (
          <ShieldAlert className="h-4 w-4 text-accent" aria-label="Email not verified" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-lg">
          <div className="truncate px-2 py-1 text-xs font-bold text-muted-foreground">
            {user.email}
          </div>

          {!user.emailVerified && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openAuthModal();
              }}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-bold text-accent transition hover:bg-muted"
            >
              <ShieldAlert className="h-4 w-4" />
              Verify email
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-bold text-foreground transition hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
