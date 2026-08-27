import { FirebaseError } from "firebase/app";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "An account already exists with this email address.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/weak-password": "Choose a stronger password (at least 8 characters).",
  "auth/invalid-credential": "The email or password you entered is incorrect.",
  "auth/wrong-password": "The email or password you entered is incorrect.",
  "auth/user-not-found": "The email or password you entered is incorrect.",
  "auth/user-disabled": "This account has been disabled. Contact support for help.",
  "auth/too-many-requests": "Too many attempts. Wait a moment before trying again.",
  "auth/popup-closed-by-user": "Sign-in was cancelled before it finished.",
  "auth/popup-blocked": "Your browser blocked the sign-in popup. Allow popups and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
};

// auth/user-not-found and auth/wrong-password map to the same generic message
// as auth/invalid-credential on purpose: telling an attacker "no such user" vs
// "wrong password" reveals which emails have accounts (account enumeration).
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return ERROR_MESSAGES[error.code] || "Something went wrong. Please try again.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
