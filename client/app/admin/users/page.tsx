"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import AdminGate from "../components/AdminGate";
import UserManagementTable from "../components/UserManagementTable";
import AdminEmptyState from "../components/AdminEmptyState";
import AdminErrorState from "../components/AdminErrorState";
import { AdminTableSkeleton } from "../components/AdminSkeleton";
import {
  fetchAdminUsers,
  type AdminUser,
} from "@/lib/adminApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<
    AdminUser[]
  >([]);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
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
      const data = await fetchAdminUsers(
        page,
        search,
      );
      setUsers(data.items);
      setHasMore(data.hasMore);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AdminGate requireAdmin>
      <AdminHeader
        title="User management"
        subtitle="Roles, blocks, and mutes"
      />

      <div className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <form
          className="glass-panel flex flex-col gap-3 rounded-2xl border border-border/60 p-4 sm:flex-row sm:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setSearch(query.trim());
          }}
        >
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Search by username or email"
              className="pl-9"
              aria-label="Search users"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {error && (
          <AdminErrorState onRetry={load} />
        )}

        {loading && !error && (
          <AdminTableSkeleton rows={8} />
        )}

        {!loading &&
          !error &&
          users.length === 0 && (
            <AdminEmptyState
              icon={Users}
              title="No users found"
              description="Try a different search term or clear the filter."
            />
          )}

        {!loading &&
          !error &&
          users.length > 0 && (
            <>
              <UserManagementTable
                users={users}
                onUpdated={load}
              />
              {hasMore && (
                <div
                  className={cn(
                    "flex justify-center",
                  )}
                >
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
    </AdminGate>
  );
}
