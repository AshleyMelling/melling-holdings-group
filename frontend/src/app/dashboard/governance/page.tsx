// /home/remem/bitcoinholdings/frontend/src/app/dashboard/page.tsx
import React from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { GovernanceDataTable } from "/home/remem/bitcoinholdings/frontend/src/app/dashboard/governance/components/data_table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import GovernanceClient from "/home/remem/bitcoinholdings/frontend/src/app/dashboard/governance/components/GovernanceClient";

import data from "./data.json";

export default async function GovernancePage() {
  // Await cookies() before using its value
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    // Redirect to login if no token is found
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
              <GovernanceClient initialData={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
