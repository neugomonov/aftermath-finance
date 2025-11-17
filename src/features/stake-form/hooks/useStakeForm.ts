import { useState, useCallback, useMemo } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { sanitizeNumberInput } from "shared/lib/input";
import { stakingUseCase } from "entities/staking";
import { notificationService } from "shared/lib";

interface UseStakeFormParams {
  balance?: { formatted: string } | null;
  onValidationError?: (error: string | null) => void;
}

interface UseStakeFormResult {
  amountIn: string;
  handleInputChange: (value: string) => void;
  handleMaxClick: () => void;
  clearAmount: () => void;
  isValidInput: boolean;
}

export function useStakeForm({
  balance,
  onValidationError,
}: UseStakeFormParams): UseStakeFormResult {
  const currentAccount = useCurrentAccount();
  const [amountIn, setAmountIn] = useState("");

  const handleInputChange = useCallback(
    (value: string) => {
      const sanitized = sanitizeNumberInput(value);
      if (!sanitized.isValid) {
        return;
      }
      setAmountIn(sanitized.value);
      onValidationError?.(null);
    },
    [onValidationError]
  );

  const handleMaxClick = useCallback(() => {
    if (!balance || !currentAccount) {
      notificationService.error("Unable to fetch balance");
      return;
    }
    const maxAmount = parseFloat(balance.formatted);
    if (maxAmount > 0) {
      setAmountIn(maxAmount.toString());
      onValidationError?.(null);
    }
  }, [balance, currentAccount, onValidationError]);

  const clearAmount = useCallback(() => {
    setAmountIn("");
    onValidationError?.(null);
  }, [onValidationError]);

  const isValidInput = useMemo(
    () => stakingUseCase.canStake(amountIn, balance, !!currentAccount),
    [amountIn, currentAccount, balance]
  );

  return {
    amountIn,
    handleInputChange,
    handleMaxClick,
    clearAmount,
    isValidInput,
  };
}
