"use client";

import { useTheme } from "next-themes";
import { AvatarImage } from "@/components/ui/avatar"; // adjust import as needed

export function ThemedAvatar({ alt }: { alt: string }) {
  const { theme } = useTheme();
  const defaultAvatar = theme === "dark" ? "/MHGLight.svg" : "/MHGDark.svg";

  return <AvatarImage src={defaultAvatar} alt={alt} />;
}
