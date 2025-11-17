import { useState, useCallback, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { stakingUseCase } from "entities/staking";

interface UseEstimateParams {
  amount: string;
  balance?: { formatted: string } | null;
}

interface UseEstimateResult {
  estimatedAfSUI: string | null;
  isLoadingEstimate: boolean;
  estimateError: string | null;
}

export function useEstimate({
  amount,
  balance,
}: UseEstimateParams): UseEstimateResult {
  const currentAccount = useCurrentAccount();
  const [estimatedAfSUI, setEstimatedAfSUI] = useState<string | null>(null);
  const [isLoadingEstimate, setIsLoadingEstimate] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);

  const fetchEstimate = useCallback(async () => {
    if (!amount || !currentAccount) {
      setEstimatedAfSUI(null);
      setEstimateError(null);
      return;
    }

    const validation = stakingUseCase.validateForEstimate(amount, balance);

    if (!validation.canEstimate) {
      setEstimatedAfSUI(null);
      setEstimateError(validation.isValid ? null : validation.error || null);
      return;
    }

    setIsLoadingEstimate(true);
    setEstimateError(null);

    try {
      const estimate = await stakingUseCase.estimateAfSUI(amount);
      setEstimatedAfSUI(estimate);
      setEstimateError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch estimate";
      setEstimateError(errorMessage);
      setEstimatedAfSUI(null);
    } finally {
      setIsLoadingEstimate(false);
    }
  }, [amount, currentAccount, balance]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEstimate();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [fetchEstimate]);

  return {
    estimatedAfSUI,
    isLoadingEstimate,
    estimateError,
  };
}
