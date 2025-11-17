import { useCallback } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { stakingUseCase } from "entities/staking";
import { formatSUI } from "shared/lib/format";
import { notificationService } from "shared/lib";

interface UseStakeTransactionParams {
  balance?: { formatted: string } | null;
  onTransactionAdd: (tx: {
    type: "stake";
    amount: string;
    status: "pending" | "success" | "failed";
  }) => string;
  onTransactionUpdate: (
    id: string,
    updates: {
      status: "pending" | "success" | "failed";
      txDigest?: string;
    }
  ) => void;
}

interface StakeTransactionResult {
  executeStake: (amountIn: string) => Promise<boolean>;
  isExecuting: boolean;
}

export function useStakeTransaction({
  balance,
  onTransactionAdd,
  onTransactionUpdate,
}: UseStakeTransactionParams): StakeTransactionResult {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute, isPending: isExecuting } =
    useSignAndExecuteTransaction();

  const executeStake = useCallback(
    async (amountIn: string): Promise<boolean> => {
      if (!currentAccount || !amountIn) {
        notificationService.error(
          "Please connect your wallet and enter an amount"
        );
        return false;
      }

      const validation = stakingUseCase.validateStakeAmount(amountIn, balance);
      if (!validation.isValid) {
        notificationService.error(validation.error || "Invalid amount");
        return false;
      }

      const loadingToast = notificationService.loading(
        "Preparing transaction..."
      );

      const txId = onTransactionAdd({
        type: "stake",
        amount: amountIn,
        status: "pending",
      });

      if (!txId) {
        notificationService.dismiss(loadingToast);
        notificationService.error("Failed to initialize transaction");
        return false;
      }

      const result = await stakingUseCase.buildStakeTransaction({
        amount: amountIn,
        senderAddress: currentAccount.address,
      });

      if (!result.success || !result.transaction) {
        notificationService.dismiss(loadingToast);
        onTransactionUpdate(txId, {
          status: "failed",
        });
        notificationService.error(
          result.error?.userFriendlyMessage || "Failed to build transaction"
        );
        return false;
      }

      notificationService.dismiss(loadingToast);

      return new Promise((resolve) => {
        signAndExecute(
          {
            transaction: result.transaction as unknown as Parameters<
              typeof signAndExecute
            >[0]["transaction"],
          },
          {
            onSuccess: (result) => {
              onTransactionUpdate(txId, {
                status: "success",
                txDigest: result.digest,
              });
              notificationService.success(
                `Successfully staked ${formatSUI(amountIn)} SUI!`
              );
              resolve(true);
            },
            onError: (err) => {
              onTransactionUpdate(txId, {
                status: "failed",
              });

              const errorMessage =
                err instanceof Error ? err.message : "Transaction failed";
              notificationService.error(errorMessage);
              resolve(false);
            },
          }
        );
      });
    },
    [
      currentAccount,
      balance,
      onTransactionAdd,
      onTransactionUpdate,
      signAndExecute,
    ]
  );

  return {
    executeStake,
    isExecuting,
  };
}
