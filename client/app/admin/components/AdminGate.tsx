"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import {
  fetchCurrentUser,
  isStaffRole,
} from "@/lib/adminApi";
import { AdminStatSkeleton } from "./AdminSkeleton";
import { cn } from "@/lib/utils";

export default function AdminGate({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "allowed" | "denied"
  >("loading");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const user =
          await fetchCurrentUser();

        if (cancelled) return;

        const staff = isStaffRole(
          user.role,
        );
        const admin =
          user.role === "admin";

        if (
          !staff ||
          (requireAdmin && !admin)
        ) {
          setStatus("denied");
          return;
        }

        setStatus("allowed");
      } catch {
        if (!cancelled) {
          router.replace("/login");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [requireAdmin, router]);

  if (status === "loading") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, i) => (
            <AdminStatSkeleton key={i} />
          ),
        )}
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div
        className={cn(
          "glass-panel mx-auto max-w-lg rounded-2xl border border-border/60 p-8 text-center",
          "animate-fade-in motion-reduce:animate-none",
        )}
      >
        <Shield
          className="mx-auto mb-4 size-10 text-muted-foreground"
          aria-hidden
        />
        <h2 className="text-title text-foreground">
          Access restricted
        </h2>
        <p className="mt-2 text-body text-muted-foreground">
          This area is for administrators and
          moderators only.
        </p>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className={cn(
            "mt-6 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground",
            "transition-opacity hover:opacity-90",
          )}
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
