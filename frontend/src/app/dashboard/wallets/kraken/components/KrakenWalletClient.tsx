"use client";

import dynamic from "next/dynamic";

// Lazy-load the KrakenDataTable component
const KrakenDataTable = dynamic(() => import("./KrakenDataTable"), {
  ssr: false,
});

export function KrakenClient() {
  return (
    <div className="flex flex-col gap-6">
      <KrakenDataTable />
    </div>
  );
}
