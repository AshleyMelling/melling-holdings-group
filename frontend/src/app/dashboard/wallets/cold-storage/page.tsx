// app/dashboard/wallets/page.tsx
import React from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { WalletDataTable } from "./components/WalletDataTable";
import { walletSchema } from "./components/schema";
import { z } from "zod";

// Example mock data for wallets
const mockData: z.infer<typeof walletSchema>[] = [
  {
    id: 1,
    label: "Cold Wallet",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    balance: "1.02 BTC",
    lastChecked: "2025-04-04 13:00",
    category: "Cold",
    notes: "Ledger Nano X",
  },
  {
    id: 2,
    label: "Hot Wallet",
    address: "bc1qar0srlr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    balance: "0.21 BTC",
    lastChecked: "2025-04-04 13:05",
    category: "Hot",
    notes: "Mobile wallet",
  },
];

export default async function WalletsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <h1 className="text-2xl font-bold px-4">
                On-Chain Wallet Tracker
              </h1>
              <div className="px-4 lg:px-6">
                <WalletDataTable data={mockData} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
