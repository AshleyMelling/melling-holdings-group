// types/account.ts
export type WalletSummary = {
  label: string;
  balance: number;
};

export type AccountWithDetails = {
  account: string;
  walletCount: number;
  totalBTC: number;
  averageBalance: number;
  largestWallet: WalletSummary;
  smallestWallet: WalletSummary;
  totalUnconfirmedTxs: number;
};
