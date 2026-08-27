"use client";

import { useState, type FormEvent } from "react";
import { theme } from "@/styles/theme";
import { useAuth } from "@/components/auth/AuthProvider";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import {
  getConfirmPasswordValidationError,
  getEmailValidationError,
  getSignInPasswordValidationError,
  getSignUpPasswordValidationError,
} from "@/lib/auth/validation";

type AuthMode = "sign-in" | "sign-up";

type FieldErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const fieldErrorClass = "mt-1 text-xs font-bold text-destructive";

export default function AuthForm() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const busy = submitting || googleSubmitting;

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setFieldErrors({});
    setFormError("");
    setConfirmPassword("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const emailError = getEmailValidationError(email);
    const passwordError =
      mode === "sign-up"
        ? getSignUpPasswordValidationError(password)
        : getSignInPasswordValidationError(password);
    const confirmError =
      mode === "sign-up"
        ? getConfirmPasswordValidationError(password, confirmPassword)
        : null;

    const nextFieldErrors: FieldErrors = {
      email: emailError ?? undefined,
      password: passwordError ?? undefined,
      confirmPassword: confirmError ?? undefined,
    };

    setFieldErrors(nextFieldErrors);

    if (emailError || passwordError || confirmError) {
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "sign-up") {
        await signUpWithEmail(email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError("");
    setGoogleSubmitting(true);

    try {
      await signInWithGoogle();
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2 rounded-xl border border-border bg-muted p-1">
        <button
          type="button"
          onClick={() => switchMode("sign-in")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-black transition ${
            mode === "sign-in"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => switchMode("sign-up")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-black transition ${
            mode === "sign-up"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          Create Account
        </button>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={busy}
        className={`${theme.buttonSecondary} mt-4 flex w-full items-center justify-center gap-2`}
      >
        {googleSubmitting ? "Connecting..." : "Continue with Google"}
      </button>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          or
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        <div>
          <label className={theme.labelDark}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (fieldErrors.email) {
                setFieldErrors((current) => ({ ...current, email: undefined }));
              }
            }}
            className={theme.inputLight}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {fieldErrors.email && <p className={fieldErrorClass}>{fieldErrors.email}</p>}
        </div>

        <div>
          <label className={theme.labelDark}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (fieldErrors.password) {
                setFieldErrors((current) => ({ ...current, password: undefined }));
              }
            }}
            className={theme.inputLight}
            placeholder="••••••••"
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
          />
          {fieldErrors.password && (
            <p className={fieldErrorClass}>{fieldErrors.password}</p>
          )}
          {mode === "sign-up" && !fieldErrors.password && (
            <p className="mt-1 text-xs text-muted-foreground">
              At least 8 characters.
            </p>
          )}
        </div>

        {mode === "sign-up" && (
          <div>
            <label className={theme.labelDark}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (fieldErrors.confirmPassword) {
                  setFieldErrors((current) => ({
                    ...current,
                    confirmPassword: undefined,
                  }));
                }
              }}
              className={theme.inputLight}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {fieldErrors.confirmPassword && (
              <p className={fieldErrorClass}>{fieldErrors.confirmPassword}</p>
            )}
          </div>
        )}

        {formError && <div className={theme.errorBox}>{formError}</div>}

        <button
          type="submit"
          disabled={busy}
          className={`${theme.buttonPrimary} mt-1 w-full`}
        >
          {submitting
            ? mode === "sign-up"
              ? "Creating account..."
              : "Signing in..."
            : mode === "sign-up"
              ? "Create Account"
              : "Sign In"}
        </button>
      </form>
    </div>
  );
}
