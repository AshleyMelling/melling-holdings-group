"use client";

import dynamic from "next/dynamic";

// Lazy-load the KrakenDataTable component
const KrakenDataTable = dynamic(() => import("./KrakenDataTable"), {
  ssr: false,
});

const KrakenHistoryTable = dynamic(() => import("./KrakenHistoryTable"), {
  ssr: false,
});

const KrakenLedgerHistoryTable = dynamic(() => import("./KrakenLedgerHistoryTable"), { 
    ssr: false,
});



export function KrakenClient() {
  return (
    <div className="flex flex-col gap-6">
      <KrakenDataTable />
      <KrakenHistoryTable />
      <KrakenLedgerHistoryTable />
    </div>
  );
}
