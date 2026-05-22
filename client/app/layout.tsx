"use client";

import "./globals.css";
import { useEffect, useState, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../context/AuthContext";
import FloatingMessenger from "./dashboard/components/FloatingMessenger";
import { Geist } from "next/font/google";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const themeInitScript = `(function(){try{var s=localStorage.getItem("darkMode");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;var t=s==="true"?!0:s==="false"?!1:d;document.documentElement.classList.toggle("dark",t);}catch(e){}})();`;

function getIsDark(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(getIsDark());
  }, []);

  const toggleTheme = useCallback(() => {
    const next = !getIsDark();
    setDark(next);
    localStorage.setItem("darkMode", String(next));
    document.documentElement.classList.toggle("dark", next);
  }, []);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased",
          "selection:bg-primary/20",
        )}
      >
        <AuthProvider>
          <Toaster
            toastOptions={{
              className: cn(
                "!bg-card !text-card-foreground !border-border !shadow-md",
                "!rounded-xl !text-sm",
              ),
            }}
          />

          {children}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={dark}
            className={cn(
              "glass-panel shadow-glow-brand interactive-lift",
              "fixed z-[999] flex size-11 items-center justify-center rounded-full",
              "text-brand-foreground sm:size-12",
              "bottom-20 left-4 sm:bottom-6 sm:left-6",
              "bg-gradient-brand border-0",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            {dark ? (
              <Sun className="size-5" aria-hidden="true" />
            ) : (
              <Moon className="size-5" aria-hidden="true" />
            )}
          </button>

          <FloatingMessenger />
        </AuthProvider>
      </body>
    </html>
  );
}
