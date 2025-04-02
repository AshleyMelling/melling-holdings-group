import { LoginForm } from "@/components/login-form";
import SiteHeader from "@/components/SiteHeader";

export default function Page() {
  return (
    <div className="relative">
      {/* Background layer */}
      <div className="absolute inset-0 z-0"></div>
      {/* Content layer */}
      <div className="relative z-10 flex flex-col min-h-screen bg-transparent text-foreground">
        <SiteHeader mobileMenuOpen={undefined} setMobileMenuOpen={undefined} />
        {/* Hero section (in this case, the login form) */}
        <main className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </main>
        <footer
          className="
            w-full py-3 text-center text-sm text-muted-foreground border-t
            backdrop-blur-md bg-background/70
          "
        >
          &copy; 2025 Melling Holdings Group — Internal Use Only
        </footer>
      </div>
    </div>
  );
}
