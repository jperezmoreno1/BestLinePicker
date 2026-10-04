"use client";

import { theme } from "@/styles/theme";
import { useAuth } from "@/components/auth/AuthProvider";

export default function SignInButton() {
  const { openAuthModal } = useAuth();

  return (
    <button type="button" onClick={openAuthModal} className={theme.buttonPrimary}>
      Sign In
    </button>
  );
}
