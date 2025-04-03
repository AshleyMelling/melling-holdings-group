import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface GovernanceEventCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  date: string;
  alignRight?: boolean;
}

export default function GovernanceEventCard({
  title,
  description,
  icon,
  date,
  alignRight = false,
}: GovernanceEventCardProps) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-8 mb-16",
        alignRight ? "flex-row-reverse text-right" : ""
      )}
    >
      <div className="flex-1">
        <div
          className={cn(
            "bg-[#111111] border border-[#222222] p-6 rounded-xl relative group",
            alignRight
              ? "rounded-tr-none before:absolute before:top-0 before:right-0 before:border-l-[20px] before:border-l-transparent before:border-t-[20px] before:border-t-[#f97316]/30"
              : "rounded-tl-none before:absolute before:top-0 before:left-0 before:border-r-[20px] before:border-r-transparent before:border-t-[20px] before:border-t-[#f97316]/30"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#f97316]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          <div className="text-xs text-[#f97316]/70 mb-1 font-sans">{date}</div>
          <h3 className="text-xl font-serif font-bold mb-2">{title}</h3>
          <p className="text-[#f5f5f5]/70 font-sans">{description}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 p-0 text-[#f97316] hover:text-[#f97316] hover:bg-transparent group-hover:translate-x-1 transition-transform duration-300 font-sans"
          >
            View Documentation <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
        <div className="h-12 w-12 rounded-full bg-[#0f0f0f] border-2 border-[#f97316] flex items-center justify-center text-[#f97316]">
          {icon}
        </div>
      </div>
      <div className="flex-1" />
    </div>
  );
}
