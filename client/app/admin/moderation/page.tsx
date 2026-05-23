"use client";

import { useCallback, useEffect, useState } from "react";
import { Flag } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import ModerationTable from "../components/ModerationTable";
import AdminEmptyState from "../components/AdminEmptyState";
import AdminErrorState from "../components/AdminErrorState";
import { AdminTableSkeleton } from "../components/AdminSkeleton";
import {
  fetchModerationQueue,
  type AdminPost,
} from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminModerationPage() {
  const [items, setItems] = useState<
    AdminPost[]
  >([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] =
    useState(false);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data =
        await fetchModerationQueue(
          page,
        );
      setItems(data.items);
      setHasMore(data.hasMore);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <AdminHeader
        title="Moderation"
        subtitle="Review reported and hidden content"
      />

      <div
        className={cn(
          "flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8",
        )}
      >
        {error && (
          <AdminErrorState onRetry={load} />
        )}

        {loading && !error && (
          <AdminTableSkeleton rows={6} />
        )}

        {!loading &&
          !error &&
          items.length === 0 && (
            <AdminEmptyState
              icon={Flag}
              title="Queue is empty"
              description="No reported or hidden posts right now. New reports will appear here automatically."
            />
          )}

        {!loading &&
          !error &&
          items.length > 0 && (
            <>
              <ModerationTable
                items={items}
                onUpdated={load}
              />
              {hasMore && (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setPage((p) => p + 1)
                    }
                  >
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
      </div>
    </>
  );
}
