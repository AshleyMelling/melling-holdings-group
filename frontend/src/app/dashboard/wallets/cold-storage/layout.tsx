import { ReactNode } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Toaster } from "sonner"; // Import the Toaster

export default function WalletTrackerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="min-h-screen">
      {children}
      <Toaster position="top-center" /> {/* Render the Toaster */}
    </section>
  );
}
