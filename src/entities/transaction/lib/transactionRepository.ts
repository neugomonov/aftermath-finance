import type { TransactionRecord } from "../model/types";

const STORAGE_KEY = "staking-transactions";

export const transactionRepository = {
  getAll: (walletAddress: string): TransactionRecord[] => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}-${walletAddress}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  save: (walletAddress: string, transactions: TransactionRecord[]): void => {
    try {
      localStorage.setItem(
        `${STORAGE_KEY}-${walletAddress}`,
        JSON.stringify(transactions)
      );
    } catch (error) {
      console.error("Failed to save transactions:", error);
    }
  },

  add: (
    walletAddress: string,
    transaction: Omit<TransactionRecord, "id" | "timestamp">
  ): TransactionRecord => {
    const newTx: TransactionRecord = {
      ...transaction,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };

    const existing = transactionRepository.getAll(walletAddress);
    const updated = [newTx, ...existing].slice(0, 10);
    transactionRepository.save(walletAddress, updated);

    return newTx;
  },

  update: (
    walletAddress: string,
    id: string,
    updates: Partial<TransactionRecord>
  ): void => {
    const existing = transactionRepository.getAll(walletAddress);
    const updated = existing.map((tx) =>
      tx.id === id ? { ...tx, ...updates } : tx
    );
    transactionRepository.save(walletAddress, updated);
  },

  clear: (walletAddress: string): void => {
    localStorage.removeItem(`${STORAGE_KEY}-${walletAddress}`);
  },
};
