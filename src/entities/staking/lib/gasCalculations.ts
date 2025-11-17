import { GAS_RESERVE_SUI } from "./constants";

export interface GasValidation {
  isValid: boolean;
  error?: string;
  availableForStaking?: number;
}

export function validateBalanceWithGas(
  stakeAmount: number,
  totalBalance: number
): GasValidation {
  const availableForStaking = totalBalance - GAS_RESERVE_SUI;

  if (availableForStaking <= 0) {
    return {
      isValid: false,
      error: `Insufficient balance for gas fees. Need at least ${GAS_RESERVE_SUI} SUI for gas.`,
      availableForStaking: 0,
    };
  }

  if (stakeAmount > availableForStaking) {
    return {
      isValid: false,
      error: `Insufficient balance. Need at least ${GAS_RESERVE_SUI} SUI for gas fees.`,
      availableForStaking,
    };
  }

  return {
    isValid: true,
    availableForStaking,
  };
}
