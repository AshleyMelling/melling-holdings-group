"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";

// Lazy-load each table component
const KrakenDataTable = dynamic(() => import("../accounts/components/KrakenDataTable"), {
  ssr: false,
  loading: () => <p>Loading Kraken Data Table...</p>,
});

const KrakenHistoryTable = dynamic(() => import("../trades/components/KrakenTradeHistoryTable"), {
  ssr: false,
  loading: () => <p>Loading Trade History...</p>,
});

const KrakenLedgerHistoryTable = dynamic(
  () => import("../ledger/components/KrakenLedgerHistoryTable"),
  {
    ssr: false,
    loading: () => <p>Loading Ledger History...</p>,
  }
);

export function KrakenClient() {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<p>Loading Kraken Data...</p>}>
        <KrakenDataTable />
        <KrakenHistoryTable />
        <KrakenLedgerHistoryTable />
      </Suspense>
    </div>
  );
}
