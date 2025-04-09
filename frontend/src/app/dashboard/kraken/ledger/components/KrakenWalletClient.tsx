"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";


const KrakenLedgerHistoryTable = dynamic(
  () =>
    import(
      "/home/remem/bitcoinholdings/frontend/src/app/dashboard/kraken/ledger/components/KrakenLedgerHistoryTable"
    ),
  {
    ssr: false,
    loading: () => <p>Loading Ledger History...</p>,
  }
);

export function KrakenClient() {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<p>Loading Kraken Data...</p>}>
        <KrakenLedgerHistoryTable />
      </Suspense>
    </div>
  );
}
