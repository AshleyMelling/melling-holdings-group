import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "./mode-toggle";


export default function Header() {
  return (
    <header
      className="
        relative z-20 flex h-12 shrink-0 items-center gap-2
        border-b transition-[width,height] ease-linear
        backdrop-blur-md bg-background/70
        group-has-data-[collapsible=icon]/sidebar-wrapper:h-[--header-height]    
    "
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <a href="/" className="flex items-center">
          <Image
            src="/MHGLight.svg"
            alt="Melling Holdings Logo"
            width={24}
            height={24}
            className="h-6 w-6 object-contain block dark:hidden"
          />
          <Image
            src="/MHGDark.svg"
            alt="Melling Holdings Logo"
            width={24}
            height={24}
            className="h-6 w-6 object-contain hidden dark:block"
          />
        </a>
        <a href="/" className="text-base font-medium">
          MellingHoldingsGroup
        </a>
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Optional separator to keep layout spacing */}
        <Separator orientation="vertical" className="mx-2 h-4" />

        <div className="ml-auto flex items-center gap-2">
          {/* Login button */}
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <Button variant="ghost" asChild size="sm" className="flex">
            <a href="/login" className="dark:text-foreground">
              Login
            </a>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
