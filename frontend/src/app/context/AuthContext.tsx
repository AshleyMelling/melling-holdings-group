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

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setUser(null);
    router.push("/login");
  };

  const validateToken = async () => {
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
    validateToken();
  }, [pathname]);

  useEffect(() => {
    const interval = setInterval(validateToken, 60_000);
    return () => clearInterval(interval);
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
