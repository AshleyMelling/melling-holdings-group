import { ReactNode } from "react";
import { Toaster } from "sonner"; // Import the Toaster

export default function KrakenLayout({
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
