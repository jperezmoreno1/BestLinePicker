"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthForm from "@/components/auth/AuthForm";
import VerifyEmailNotice from "@/components/auth/VerifyEmailNotice";

export default function AuthModal() {
  const { user, isAuthModalOpen, closeAuthModal } = useAuth();

  // Once the signed-in user is verified there is nothing left for this modal
  // to show, so it dismisses itself instead of leaving a stale dialog open.
  useEffect(() => {
    if (isAuthModalOpen && user?.emailVerified) {
      closeAuthModal();
    }
  }, [isAuthModalOpen, user, closeAuthModal]);

  useEffect(() => {
    if (!isAuthModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAuthModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={closeAuthModal}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
              BestLinePicker
            </p>
            {!user && (
              <h2 className="mt-1 text-xl font-black text-foreground">Sign In</h2>
            )}
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            aria-label="Close"
            className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {user ? <VerifyEmailNotice /> : <AuthForm />}
      </div>
    </div>
  );
}
