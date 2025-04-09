"use client";

import dynamic from "next/dynamic";

// Lazy-load both components
const WalletDataTable = dynamic(() => import("./WalletDataTable"), {
  ssr: false,
});

const AccountDataTable = dynamic(() => import("./AccountDataTable"), {
  ssr: false,
});

export function ColdWalletClient() {
  return (
    <div className="flex flex-col gap-6">
      <AccountDataTable />
      <WalletDataTable />
    </div>
  );
}
