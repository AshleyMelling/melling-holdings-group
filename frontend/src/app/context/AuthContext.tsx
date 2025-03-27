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

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/";
    setUser(null);
    router.push("/login");
  };

  const validateToken = () => {
    const token = getCookie("token");

    if (!token) {
      setUser(null);

      // Redirect only if on a protected page
      if (isProtectedRoute(pathname)) {
        logout();
      }

      return;
    }

    fetch("/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setUser({ name: data.name, email: data.email });
      })
      .catch((err) => {
        console.error("Error validating token:", err);
        setUser(null);

        // If token is bad and we're on a protected route — force logout
        if (isProtectedRoute(pathname)) {
          logout();
        }
      });
  };

  const isProtectedRoute = (path: string) => {
    return path.startsWith("/dashboard");
  };

  useEffect(() => {
    validateToken();
  }, [pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      validateToken();
    }, 60000);
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
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
