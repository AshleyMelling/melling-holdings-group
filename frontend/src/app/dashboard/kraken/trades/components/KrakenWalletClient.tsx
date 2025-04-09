"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const KrakenHistoryTable = dynamic(
  () =>
    import(
      "/home/remem/bitcoinholdings/frontend/src/app/dashboard/kraken/trades/components/KrakenTradeHistoryTable"
    ),
  {
    ssr: false,
    loading: () => <p>Loading Trade History...</p>,
  }
);


export function KrakenClient() {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<p>Loading Kraken Data...</p>}>
        <KrakenHistoryTable />
      </Suspense>
    </div>
  );
}
