import { PageTitle } from "@/components/PageTitle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {/* Wrap PageTitle in an h1 for proper semantic structure */}
        <h1 className="text-base font-medium">
          <PageTitle />
        </h1>
        <div className="ml-auto flex items-center gap-2">
          {/* Right-side icons or buttons */}
        </div>
      </div>
    </header>
  );
}
