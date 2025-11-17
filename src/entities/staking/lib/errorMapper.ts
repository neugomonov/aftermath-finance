import { MIN_STAKE_AMOUNT_SUI } from "./constants";

export interface MappedError {
  userFriendlyMessage: string;
  originalError: string;
}

export function mapStakingError(
  error: unknown,
  stakeAmount?: number
): MappedError {
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("MoveAbort")) {
    if (stakeAmount !== undefined && stakeAmount < MIN_STAKE_AMOUNT_SUI) {
      return {
        userFriendlyMessage: `Transaction failed: The stake amount (${stakeAmount.toFixed(
          9
        )} SUI) is below the minimum required. Try staking at least ${MIN_STAKE_AMOUNT_SUI} SUI.`,
        originalError: errorMessage,
      };
    }

    return {
      userFriendlyMessage:
        "Transaction failed: Invalid stake amount or insufficient balance. Please ensure you have enough SUI (including gas fees) and the amount meets the minimum requirements.",
      originalError: errorMessage,
    };
  }

  if (errorMessage.includes("Insufficient")) {
    return {
      userFriendlyMessage: errorMessage,
      originalError: errorMessage,
    };
  }

  return {
    userFriendlyMessage: errorMessage || "Transaction failed",
    originalError: errorMessage,
  };
}
