// app/dashboard/governance/layout.tsx
import { ReactNode } from "react";

export default function DashboardGovernanceLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen">
      {children}
    </section>
  );
}
