"use client";

import type { ReactNode } from "react";
import { theme } from "@/styles/theme";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthForm from "@/components/auth/AuthForm";
import VerifyEmailNotice from "@/components/auth/VerifyEmailNotice";

type AuthGateProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

// Reusable gate for whole-page protected content (History, Tracking). Button
// -triggered actions elsewhere (Save Snapshot, Track Line) use
// useProtectedAction instead, which opens the same sign-in/verify UI as a
// modal so the user never leaves the odds board.
export default function AuthGate({
  children,
  title = "Sign in required",
  description = "Sign in to view and manage your saved data.",
}: AuthGateProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className={theme.loadingBox}>Checking your session...</div>;
  }

  if (!user) {
    return (
      <section className={theme.cardNoMargin}>
        <div className={theme.cardTitle}>{title}</div>
        <p className={theme.cardSubtitle}>{description}</p>
        <div className="mt-4">
          <AuthForm />
        </div>
      </section>
    );
  }

  if (!user.emailVerified) {
    return <VerifyEmailNotice />;
  }

  return <>{children}</>;
}
