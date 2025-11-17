import { useState, useEffect, useCallback } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { transactionRepository } from "../lib/transactionRepository";
import type { TransactionRecord } from "./types";

export function useTransactionHistory() {
  const currentAccount = useCurrentAccount();
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

  useEffect(() => {
    if (!currentAccount) {
      setTransactions([]);
      return;
    }

    const stored = transactionRepository.getAll(currentAccount.address);
    setTransactions(stored);
  }, [currentAccount]);

  const addTransaction = useCallback(
    (tx: Omit<TransactionRecord, "id" | "timestamp">): string => {
      if (!currentAccount) {
        return "";
      }

      const newTx = transactionRepository.add(currentAccount.address, tx);
      setTransactions((prev) => [newTx, ...prev].slice(0, 10));

      return newTx.id;
    },
    [currentAccount]
  );

  const updateTransaction = useCallback(
    (id: string, updates: Partial<TransactionRecord>): void => {
      if (!currentAccount) {
        return;
      }

      transactionRepository.update(currentAccount.address, id, updates);
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx))
      );
    },
    [currentAccount]
  );

  return {
    transactions,
    addTransaction,
    updateTransaction,
  };
}
