import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const truncateHash = (hash: string, length = 10) => {
  if (hash.length <= length) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};
