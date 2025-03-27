import { toast } from "sonner"; // needed for the copy-to-clipboard toast
import { Button } from "@/components/ui/button";
import { truncateHash } from "/home/remem/bitcoinholdings/frontend/src/lib/utils";

export function LabelWithValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-foreground text-sm">{value}</span>
    </div>
  );
}

export function LabelWithCopy({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="flex items-center justify-between gap-2">
        <code className="text-xs font-mono truncate text-foreground">
          {truncateHash(value)}
        </code>
        <Button
          size="icon"
          variant="ghost"
          className="size-6"
          onClick={() => {
            navigator.clipboard.writeText(value);
            toast.success(`${label} copied`);
          }}
        >
          📋
        </Button>
      </div>
    </div>
  );
}
