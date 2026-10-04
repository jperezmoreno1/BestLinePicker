"use client";

import { useAuth, type AuthUser } from "@/components/auth/AuthProvider";

type RequireVerifiedUserResult = {
  user: AuthUser | null;
  // Returns the verified user's uid if the gate passes. Otherwise opens the
  // sign-in/verify-email modal and returns null — callers should bail out
  // without performing the protected action, never fail silently.
  requireVerifiedUid: () => string | null;
};

export function useRequireVerifiedUser(): RequireVerifiedUserResult {
  const { user, openAuthModal } = useAuth();

  const requireVerifiedUid = (): string | null => {
    if (!user || !user.emailVerified) {
      openAuthModal();
      return null;
    }

    return user.uid;
  };

  return { user, requireVerifiedUid };
}
