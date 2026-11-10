// Shared form validators and error helpers
// Follows the GatedPlus validator pattern

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN_IN = /^[6-9]\d{9}$/;

export type FieldErrors<K extends string = string> = Partial<Record<K, string>>;

export const validateName = (value: string): string | undefined => {
  if (!value || !value.trim()) return 'Please enter your full name';
  return undefined;
};

export const validateEmail = (value: string): string | undefined => {
  if (!value || !value.trim()) return 'Please enter your email';
  if (!EMAIL_PATTERN.test(value.trim())) return 'Enter a valid email address';
  return undefined;
};

export const validatePhone = (value: string, strictIndian = true): string | undefined => {
  const clean = value ? value.trim() : '';
  if (!clean) return 'Please enter your phone number';

  if (strictIndian) {
    if (!PHONE_PATTERN_IN.test(clean)) {
      return 'Please enter a valid 10-digit Indian mobile number';
    }
  } else {
    if (clean.replace(/\D/g, '').length < 7) {
      return 'Enter a valid phone number';
    }
  }
  return undefined;
};

export const validatePassword = (value: string, minLength = 8): string | undefined => {
  if (!value) return 'Please enter your password';
  if (minLength && value.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  return undefined;
};

export const validateConfirm = (value: string, password: string): string | undefined => {
  if (!value) return 'Please confirm your password';
  if (value !== password) return 'Passwords do not match';
  return undefined;
};

export const validateOtp = (value: string): string | undefined => {
  if (!value || !value.trim()) return 'Please enter your OTP';
  if (!/^\d{4,6}$/.test(value.trim())) return 'Enter the 4 to 6 digit OTP';
  return undefined;
};

/** Drops empty entries and reports whether any error remains. */
export const compactErrors = <T extends FieldErrors>(errors: T): { errors: T; valid: boolean } => {
  const cleaned = Object.fromEntries(
    Object.entries(errors).filter(([, v]) => Boolean(v))
  ) as T;
  return { errors: cleaned, valid: Object.keys(cleaned).length === 0 };
};

