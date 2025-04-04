// app/dashboard/layout.tsx
import { ReactNode } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function WalletTrackerLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen">

      {children}
    </section>
  );
}
