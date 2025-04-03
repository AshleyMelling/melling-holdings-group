import Link from "next/link";
import { Bitcoin } from "lucide-react";

export default function Footer() {
  const companyLinks = ["About Us", "Our Team", "Careers", "Press", "Blog"];
  const solutionLinks = [
    "Sovereign Custody",
    "Immutable Governance",
    "Bitcoin Asset Infrastructure",
    "Global Trustless Access",
    "Enterprise Solutions",
  ];
  const legalLinks = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

  const socialLinks = [
    {
      label: "Twitter",
      href: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
        </svg>
      ),
    },
    {
      label: "GitHub",
      href: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
          <path d="M9 18c-4.51 2-5-2-7-2"></path>
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      ),
    },
    {
      label: "Telegram",
      href: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m22 2-7 20-4-9-9-4Z"></path>
          <path d="M22 2 11 13"></path>
        </svg>
      ),
    },
  ];

  return (
    <footer className="py-12 border-t border-[#222222] bg-[#0a0a0a]/80 backdrop-blur-md">
      {/* Container for both the grid and legal section */}
      <div className="w-full px-4">
        {/* Main Footer Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-full opacity-70 blur-[2px]"></div>
                <div className="absolute inset-0 bg-[#0a0a0a] rounded-full flex items-center justify-center">
                  <Bitcoin className="h-5 w-5 text-[#f97316]" />
                </div>
              </div>
              <span className="text-lg font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f97316] to-[#fbbf24]">
                Melling Holdings Group
              </span>
            </div>
            <p className="text-sm text-[#f5f5f5]/70 max-w-xs font-sans">
              Preserving generational wealth through Bitcoin and trustless
              systems designed for the sovereign individual.
            </p>
            <p className="mt-6 text-sm italic text-[#f5f5f5]/50 font-serif">
              "Write Once, Immutable Forever"
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-serif font-medium mb-4 text-[#f5f5f5]">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((item, i) => (
                <li key={i}>
                  <Link
                    href="#"
                    className="text-sm font-sans text-[#f5f5f5]/70 hover:text-[#f97316] transition-colors relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#f97316] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-serif font-medium mb-4 text-[#f5f5f5]">
              Solutions
            </h3>
            <ul className="space-y-3">
              {solutionLinks.map((item, i) => (
                <li key={i}>
                  <Link
                    href="#"
                    className="text-sm font-sans text-[#f5f5f5]/70 hover:text-[#f97316] transition-colors relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#f97316] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Socials */}
          <div>
            <h3 className="font-serif font-medium mb-4 text-[#f5f5f5]">
              Connect
            </h3>
            <ul className="space-y-3 font-sans">
              <li className="text-sm text-[#f5f5f5]/70">
                123 Financial District
              </li>
              <li className="text-sm text-[#f5f5f5]/70">New York, NY 10004</li>
              <li>
                <Link
                  href="mailto:contact@mellinggroup.com"
                  className="text-sm text-[#f5f5f5]/70 hover:text-[#f97316] transition-colors"
                >
                  contact@mellinggroup.com
                </Link>
              </li>
              <li>
                <Link
                  href="tel:+15551234567"
                  className="text-sm text-[#f5f5f5]/70 hover:text-[#f97316] transition-colors"
                >
                  +1 (555) 123-4567
                </Link>
              </li>
            </ul>

            <div className="flex gap-4 mt-6">
              {socialLinks.map(({ icon, href, label }, i) => (
                <Link
                  key={i}
                  href={href}
                  aria-label={label}
                  className="text-[#f5f5f5]/70 hover:text-[#f97316] transition-colors p-2 rounded-full hover:bg-[#f97316]/10"
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Section */}
        <div className="mt-12 pt-6 border-t border-[#222222]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-[#f5f5f5]/50 font-sans">
              © {new Date().getFullYear()} Melling Holdings Group. All rights
              reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              {legalLinks.map((item, i) => (
                <Link
                  key={i}
                  href="#"
                  className="text-sm font-sans text-[#f5f5f5]/50 hover:text-[#f97316] transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
