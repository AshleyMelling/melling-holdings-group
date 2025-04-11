"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isProtectedRoute = (path: string) => path.startsWith("/dashboard");

  // Clears cookies during logout
  const clearCookies = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      clearCookies(); // Clear the token cookie
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setUser(null);
    router.push("/");
  };

  const validateToken = async () => {
    console.log("validateToken called with pathname:", pathname);
    if (!isProtectedRoute(pathname)) return;

    try {
      const res = await fetch("/api/user", {
        method: "GET",
        credentials: "include", // ✅ Important to send cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (isProtectedRoute(pathname)) logout();
        console.log("Not a protected route. Skipping token validation.");
        return;
      }

      const data = await res.json();
      setUser({ name: data.name, email: data.email });
    } catch (err) {
      console.error("Error validating session:", err);
      if (isProtectedRoute(pathname)) logout();
    }
  };

  useEffect(() => {
    console.log("Current pathname:", pathname);
    // Validate token if the user navigates to a protected route
    validateToken();
  }, [pathname]);

  useEffect(() => {
    const interval = setInterval(validateToken, 60_000); // Check token every minute
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
