"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        // Save the token in a cookie
        document.cookie = `token=${data.access_token}; path=/;`;

        // Immediately update user context
        if (data.user) {
          setUser({
            name: data.user.name,
            email: data.user.email,
          });
        }

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        const errorData = await res.json();

        if (Array.isArray(errorData.detail)) {
          const messages = errorData.detail
            .map((err: any) => err.msg)
            .join(", ");
          setError(messages);
        } else if (typeof errorData.detail === "string") {
          setError(errorData.detail);
        } else {
          setError("Login failed");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-2">
        <img src="/MHGDark.svg" alt="MHG logo" className="h-10 w-auto" />
      </div>
      <h2 className="text-center text-2xl font-semibold text-white font-sans">
        Login to <span className="text-[#f97316]">MHGroup</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#f97316]">
              <User size={18} />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-10 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 text-white font-sans placeholder:text-[#f5f5f5]/50"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#f97316]">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-10 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 text-white font-sans placeholder:text-[#f5f5f5]/50"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-[#ffffff20] bg-[#ffffff10] text-[#f97316] focus:ring-[#f97316]/50"
            />
            <label
              htmlFor="remember"
              className="text-sm text-[#f5f5f5]/70 font-sans"
            >
              Remember me
            </label>
          </div>
          <a
            href="#"
            className="text-sm text-[#f97316] hover:text-[#fbbf24] transition-colors font-sans"
          >
            Forgot password?
          </a>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#f97316] text-white shadow-lg shadow-[#f97316]/20 transition-all duration-300 transform hover:scale-105 font-sans py-6"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </form>

      <p className="text-xs text-center text-[#f5f5f5]/50 font-sans mt-6">
        By signing in, you agree to our{" "}
        <a href="#" className="underline hover:text-[#f97316]">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-[#f97316]">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
