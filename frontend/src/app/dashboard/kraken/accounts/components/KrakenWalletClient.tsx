"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";

// Lazy-load each table component
const KrakenDataTable = dynamic(
  () =>
    import(
      "@/app/dashboard/kraken/accounts/components/KrakenDataTable"
    ),
  {
    ssr: false,
    loading: () => <p>Loading Kraken Data Table...</p>,
  }
);

export function KrakenClient() {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<p>Loading Kraken Data...</p>}>
        <KrakenDataTable />
      </Suspense>
    </div>
  );
}
