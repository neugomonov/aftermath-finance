export interface StakingEstimate {
  amountInSUI: string;
  estimatedAfSUI: string;
  exchangeRate: number;
}

export interface StakingTransaction {
  amountInSUI: string;
  senderAddress: string;
  validatorAddress: string;
}

export interface TransactionStatus {
  status: 'idle' | 'pending' | 'success' | 'error';
  digest?: string;
  error?: string;
}

