// Syntactic check only — confirms the string is shaped like an email, not that
// the address exists or belongs to the user. Ownership is proven separately by
// Firebase's email verification link (see VerifyEmailNotice / sendVerificationEmail).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_MIN_LENGTH = 8;

export function getEmailValidationError(rawEmail: string): string | null {
  const email = rawEmail.trim();

  if (!email) {
    return "Email is required.";
  }

  if (email !== rawEmail) {
    return "Email cannot contain leading or trailing whitespace.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "Enter a valid email address.";
  }

  return null;
}

export function getSignInPasswordValidationError(password: string): string | null {
  if (!password) {
    return "Password is required.";
  }

  return null;
}

export function getSignUpPasswordValidationError(password: string): string | null {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }

  return null;
}

export function getConfirmPasswordValidationError(
  password: string,
  confirmPassword: string
): string | null {
  if (!confirmPassword) {
    return "Confirm your password.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return null;
}
