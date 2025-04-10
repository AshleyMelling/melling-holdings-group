"use client";

import WalletDataTable from "./WalletDataTable";
import AccountDataTable from "./AccountDataTable";

export function ColdWalletClient() {
  return (
    <div className="flex flex-col gap-6">
      <AccountDataTable />
      <WalletDataTable />
    </div>
  );
}
