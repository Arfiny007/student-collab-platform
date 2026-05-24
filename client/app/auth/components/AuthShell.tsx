"use client";

import "../auth.css";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  brandingTitle?: string;
  brandingDescription?: string;
};

export default function AuthShell({
  children,
  title,
  subtitle,
  footer,
  brandingTitle = "ClassCircle",
  brandingDescription = "Connect, collaborate, and grow in a private academic community built for students and mentors.",
}: AuthShellProps) {
  return (
    <div className="auth-scene min-h-[100dvh]">
      <div className="auth-orb auth-orb--1" aria-hidden="true" />
      <div className="auth-orb auth-orb--2" aria-hidden="true" />
      <div className="auth-orb auth-orb--3" aria-hidden="true" />

      <div className="relative z-10 grid min-h-[100dvh] grid-cols-1 lg:grid-cols-2">
        {/* Branding — desktop */}
        <aside
          className={cn(
            "hidden flex-col justify-between p-10 lg:flex xl:p-14",
            "bg-gradient-brand text-brand-foreground",
          )}
          aria-label="Platform introduction"
        >
          <div className="animate-fade-in">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-xl text-brand-foreground/90 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-foreground"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <GraduationCap className="size-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                {brandingTitle}
              </span>
            </Link>
          </div>

          <div className="max-w-md space-y-4 animate-slide-up motion-reduce:animate-none">
            <h1 className="text-display text-brand-foreground">
              Your campus,
              <br />
              elevated.
            </h1>
            <p className="text-body text-brand-foreground/85 leading-relaxed">
              {brandingDescription}
            </p>
          </div>

          <p className="text-caption text-brand-foreground/60">
            Secure · Moderated · Analytics-driven
          </p>
        </aside>

        {/* Form column */}
        <main className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 xl:px-16">
          {/* Mobile brand strip */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground shadow-glow-brand">
              <GraduationCap className="size-4.5" aria-hidden="true" />
            </span>
            <span className="text-title text-gradient-brand">{brandingTitle}</span>
          </div>

          <div
            className={cn(
              "glass-panel shadow-elevated-lg mx-auto w-full max-w-[420px]",
              "rounded-2xl border border-border/50 p-6 sm:p-8",
              "animate-scale-in motion-reduce:animate-none",
            )}
          >
            <header className="mb-8 text-center sm:text-left">
              <h2 className="text-title text-foreground">{title}</h2>
              {subtitle && (
                <p className="mt-2 text-body text-muted-foreground">{subtitle}</p>
              )}
            </header>

            <div className="stagger-fade motion-reduce:[&>*]:animate-none">
              {children}
            </div>

            {footer && (
              <footer className="mt-8 border-t border-border/60 pt-6 text-center text-caption text-muted-foreground sm:text-left">
                {footer}
              </footer>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
