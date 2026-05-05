"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../context/AuthContext";
import FloatingMessenger from "./dashboard/components/FloatingMessenger";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] =
    useState(false);

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "darkMode",
      );

    if (saved === "true") {
      setDark(true);

      document.documentElement.classList.add(
        "dark",
      );
    }
  }, []);

  const toggleTheme =
    () => {
      const next =
        !dark;

      setDark(next);

      localStorage.setItem(
        "darkMode",
        String(next),
      );

      document.documentElement.classList.toggle(
        "dark",
      );
    };

  return (
    <html lang="en">
      <body className="dark:bg-gray-950 dark:text-white">

        <AuthProvider>

          <Toaster />

          {children}

          <button
            onClick={toggleTheme}
            className="fixed bottom-24 left-6 z-[999] w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-2xl"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          <FloatingMessenger />

        </AuthProvider>

      </body>
    </html>
  );
}