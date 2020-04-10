export interface TransactionInterface {
  to: string;
  from: string;
  amount: number;
}

export interface BlockInterface {
  transactions: TransactionInterface[] | string;
  previousHash: string;
  hash: string;
  calculateHash: () => string;
  mine: (difficulty: number) => void;
}

export interface BlockchainInterface {
  pendingTransactions: TransactionInterface[];
  miningReward: number;
  minePendingTransactions: (address: string) => void;
  createTransaction: (transaction: TransactionInterface) => void;
  getBalance: (address: string) => number;
  getLatestBlock: () => BlockInterface;
  isValid: () => boolean;
}
