export interface TransactionRecord {
  id: string;
  type: "stake";
  amount: string;
  timestamp: number;
  status: "pending" | "success" | "failed";
  txDigest?: string;
}
