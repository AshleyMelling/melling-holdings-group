"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "@/context/AuthContext"; // adjust path as needed

export function LogoutButton() {
  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogout = () => {
    console.log("Logging out...");
    // Clear token from localStorage
    localStorage.removeItem("token");

    // Clear token from cookie (if applicable)
    document.cookie = "token=; Max-Age=0; path=/";

    // Update your AuthContext state to reflect logged out user
    setUser(null);

    // Redirect the user to the login page
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white py-2 px-4 rounded"
    >
      Log Out
    </button>
  );
}
