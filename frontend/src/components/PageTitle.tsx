// components/PageTitle.tsx
"use client";

import { usePathname } from "next/navigation";

function formatPathname(path: string) {
  const parts = path.split("/").filter(Boolean).slice(1); // skip 'dashboard'
  return parts.length > 0
    ? `Dashboard / ${parts
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" / ")}`
    : "Dashboard";
}

export function PageTitle() {
  const pathname = usePathname();
  const title = formatPathname(pathname);

  // Return inline text or a span instead of an h1
  return <span>{title}</span>;
}
