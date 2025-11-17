export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const MIN_STAKE_AMOUNT = 1;
const MAX_DECIMALS = 9;

export function validateSUIAmount(amount: string): ValidationResult {
  if (!amount || amount.trim() === "") {
    return { isValid: false, error: "Amount is required" };
  }

  const cleaned = amount.replace(/,/g, "");
  const num = parseFloat(cleaned);

  if (isNaN(num)) {
    return { isValid: false, error: "Invalid number format" };
  }

  if (num <= 0) {
    return { isValid: false, error: "Amount must be greater than 0" };
  }

  if (num < MIN_STAKE_AMOUNT) {
    return {
      isValid: false,
      error: `Amount must be at least ${MIN_STAKE_AMOUNT} SUI`,
    };
  }

  const decimalParts = cleaned.split(".");
  if (decimalParts.length > 1 && decimalParts[1].length > MAX_DECIMALS) {
    return {
      isValid: false,
      error: `Maximum ${MAX_DECIMALS} decimal places allowed`,
    };
  }

  return { isValid: true };
}

export function validateBalance(
  amount: string,
  balance: string | number
): ValidationResult {
  const amountNum = parseFloat(amount.replace(/,/g, ""));
  const balanceNum =
    typeof balance === "string" ? parseFloat(balance) : balance;

  if (isNaN(amountNum) || isNaN(balanceNum)) {
    return { isValid: false, error: "Invalid amount or balance" };
  }

  if (amountNum > balanceNum) {
    return { isValid: false, error: "Insufficient balance" };
  }

  return { isValid: true };
}
