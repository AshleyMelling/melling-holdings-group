import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Header from "@/components/header";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header></Header>
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-20 text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            Internal Operations Portal
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            This portal is for internal use only. It provides staff access to
            reporting tools, wallet tracking, and operational dashboards.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-3 text-center text-sm text-muted-foreground border-t">
        &copy; 2025 Melling Holdings Group — Internal Use Only
      </footer>
    </div>
  );
}
