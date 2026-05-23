"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Reports review — routes to the moderation queue */
export default function AdminReportsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/moderation");
  }, [router]);

  return null;
}
