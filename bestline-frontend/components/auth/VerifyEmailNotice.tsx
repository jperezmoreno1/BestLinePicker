"use client";

import { useEffect, useState } from "react";
import { theme } from "@/styles/theme";
import { useAuth } from "@/components/auth/AuthProvider";
import { auth } from "@/lib/firebase";
import { getAuthErrorMessage } from "@/lib/auth/errors";

const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyEmailNotice() {
  const { user, sendVerificationEmail, reloadUser, signOut } = useAuth();

  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [resendError, setResendError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [checking, setChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;

    const id = window.setInterval(() => {
      setCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(id);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || resendState === "sending") return;

    setResendState("sending");
    setResendError("");

    try {
      await sendVerificationEmail();
      setResendState("sent");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setResendState("error");
      setResendError(getAuthErrorMessage(error));
    }
  };

  const handleCheckVerified = async () => {
    setChecking(true);
    setCheckMessage("");

    try {
      await reloadUser();

      // reloadUser() updates context state asynchronously, so we read
      // auth.currentUser directly for an immediate, non-stale result.
      if (!auth.currentUser?.emailVerified) {
        setCheckMessage(
          "Still not verified. Check your inbox for the link, then try again."
        );
      }
    } catch (error) {
      setCheckMessage(getAuthErrorMessage(error));
    } finally {
      setChecking(false);
    }
  };

  return (
    <section className={theme.cardNoMargin}>
      <div className={theme.cardTitle}>Verify your email</div>
      <p className={theme.cardSubtitle}>
        We sent a verification link to <strong>{user?.email}</strong>. Verify your
        email before saving snapshots or tracking lines.
      </p>

      {resendState === "sent" && cooldown > 0 && (
        <div className="mt-3 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm font-extrabold text-primary">
          Verification email sent. Check your inbox (and spam folder).
        </div>
      )}

      {resendState === "error" && <div className={theme.errorBox}>{resendError}</div>}

      {checkMessage && <div className={`${theme.loadingBox} mt-3`}>{checkMessage}</div>}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendState === "sending" || cooldown > 0}
          className={theme.buttonSecondary}
        >
          {resendState === "sending"
            ? "Sending..."
            : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend Verification Email"}
        </button>

        <button
          type="button"
          onClick={handleCheckVerified}
          disabled={checking}
          className={theme.buttonPrimary}
        >
          {checking ? "Checking..." : "I've Verified My Email"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => signOut()}
        className="mt-4 text-xs font-bold text-muted-foreground underline"
      >
        Sign out
      </button>
    </section>
  );
}
