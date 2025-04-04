"use client";

import dynamic from "next/dynamic";

const WalletDataTable = dynamic(() => import("./WalletDataTable"), {
  ssr: false,
});

export function ColdWalletClient() {
  return <WalletDataTable />;
}
