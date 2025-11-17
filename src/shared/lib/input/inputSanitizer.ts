export interface SanitizedInput {
  value: string;
  isValid: boolean;
}

const MAX_DECIMAL_PLACES = 9;

export function sanitizeNumberInput(value: string): SanitizedInput {
  const cleaned = value.replace(/[^0-9.]/g, "");

  const parts = cleaned.split(".");
  if (parts.length > 2) {
    return { value: "", isValid: false };
  }

  if (parts[1] && parts[1].length > MAX_DECIMAL_PLACES) {
    return { value: "", isValid: false };
  }

  return { value: cleaned, isValid: true };
}
