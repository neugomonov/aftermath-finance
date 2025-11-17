import { stakingService } from "../api/stakingService";
import { validateSUIAmount, validateBalance } from "shared/lib/validation";
import { parseSUIAmount } from "shared/lib/format";
import { validateBalanceWithGas } from "./gasCalculations";
import { mapStakingError } from "./errorMapper";
import type { ValidationResult } from "shared/lib/validation";
import type { Transaction } from "@mysten/sui/transactions";

export interface StakeValidationResult extends ValidationResult {
  availableForStaking?: number;
}

export interface EstimateValidationResult extends ValidationResult {
  canEstimate: boolean;
}

export interface StakeExecutionParams {
  amount: string;
  senderAddress: string;
}

export interface StakeExecutionResult {
  success: boolean;
  transaction?: Transaction;
  error?: {
    userFriendlyMessage: string;
    originalError: string;
  };
}

export class StakingUseCase {
  validateStakeAmount(
    amount: string,
    balance?: { formatted: string } | null
  ): StakeValidationResult {
    const amountValidation = validateSUIAmount(amount);
    if (!amountValidation.isValid) {
      return amountValidation;
    }

    if (!balance) {
      return { isValid: true };
    }

    const amountNum = parseSUIAmount(amount);
    const balanceNum = parseFloat(balance.formatted);

    const gasValidation = validateBalanceWithGas(amountNum, balanceNum);
    if (!gasValidation.isValid) {
      return gasValidation;
    }

    const balanceValidation = validateBalance(
      amount,
      gasValidation.availableForStaking || 0
    );

    if (!balanceValidation.isValid) {
      return {
        ...balanceValidation,
        availableForStaking: gasValidation.availableForStaking,
      };
    }

    return {
      isValid: true,
      availableForStaking: gasValidation.availableForStaking,
    };
  }

  validateForEstimate(
    amount: string,
    balance?: { formatted: string } | null
  ): EstimateValidationResult {
    if (!amount) {
      return { isValid: true, canEstimate: false };
    }

    const amountValidation = validateSUIAmount(amount);
    if (!amountValidation.isValid) {
      return { ...amountValidation, canEstimate: false };
    }

    if (balance) {
      const balanceValidation = validateBalance(amount, balance.formatted);
      if (!balanceValidation.isValid) {
        return { ...balanceValidation, canEstimate: false };
      }
    }

    return { isValid: true, canEstimate: true };
  }

  async estimateAfSUI(amount: string): Promise<string> {
    return stakingService.estimateAfSUI(amount);
  }

  async buildStakeTransaction(
    params: StakeExecutionParams
  ): Promise<StakeExecutionResult> {
    try {
      const transaction = await stakingService.buildStakeTransaction(
        params.amount,
        params.senderAddress
      );

      return {
        success: true,
        transaction,
      };
    } catch (err) {
      const amountNum = parseSUIAmount(params.amount);
      const mappedError = mapStakingError(err, amountNum);

      return {
        success: false,
        error: mappedError,
      };
    }
  }

  canStake(
    amount: string,
    balance?: { formatted: string } | null,
    hasAccount?: boolean
  ): boolean {
    if (!amount || !hasAccount) {
      return false;
    }

    const amountNum = parseSUIAmount(amount);
    if (amountNum <= 0) {
      return false;
    }

    if (balance) {
      const balanceNum = parseFloat(balance.formatted);
      if (amountNum > balanceNum) {
        return false;
      }
    }

    return true;
  }
}

export const stakingUseCase = new StakingUseCase();

