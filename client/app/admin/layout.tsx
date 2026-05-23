"use client";

import AdminSidebar from "./components/AdminSidebar";
import AdminGate from "./components/AdminGate";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGate>
      <div
        className={cn(
          "min-h-screen bg-background",
          "bg-gradient-subtle",
        )}
      >
        <div className="flex min-h-screen">
          <AdminSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            {children}
          </div>
        </div>
      </div>
    </AdminGate>
  );
}
