"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  updateAdminUser,
  type AdminUser,
  type UserRole,
} from "@/lib/adminApi";
import { cn } from "@/lib/utils";

const ROLES: UserRole[] = [
  "user",
  "teacher",
  "moderator",
  "admin",
];

export default function UserManagementTable({
  users,
  onUpdated,
}: {
  users: AdminUser[];
  onUpdated: () => void;
}) {
  const [busyId, setBusyId] = useState<
    number | null
  >(null);

  const patch = async (
    id: number,
    body: Partial<AdminUser>,
  ) => {
    setBusyId(id);
    try {
      await updateAdminUser(id, body);
      toast.success("User updated");
      onUpdated();
    } catch {
      toast.error("Update failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="glass-panel overflow-hidden rounded-2xl border border-border/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-caption uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium sm:px-6">
                User
              </th>
              <th className="px-4 py-3 font-medium">
                Role
              </th>
              <th className="px-4 py-3 font-medium">
                Reports
              </th>
              <th className="px-4 py-3 font-medium">
                Status
              </th>
              <th className="px-4 py-3 text-right font-medium sm:px-6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-muted/20"
              >
                <td className="px-4 py-4 sm:px-6">
                  <p className="font-medium text-foreground">
                    {user.username}
                  </p>
                  <p className="text-caption text-muted-foreground">
                    {user.email}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <select
                    aria-label={`Role for ${user.username}`}
                    className={cn(
                      "rounded-lg border border-input bg-background px-2 py-1.5 text-sm capitalize",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    )}
                    value={user.role}
                    disabled={
                      busyId === user.id
                    }
                    onChange={(e) =>
                      patch(user.id, {
                        role: e.target
                          .value as UserRole,
                      })
                    }
                  >
                    {ROLES.map((r) => (
                      <option
                        key={r}
                        value={r}
                      >
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4 tabular-nums text-foreground">
                  {user.reportCount}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.isBlocked && (
                      <Badge variant="destructive">
                        Blocked
                      </Badge>
                    )}
                    {user.isMuted && (
                      <Badge variant="secondary">
                        Muted
                      </Badge>
                    )}
                    {!user.isBlocked &&
                      !user.isMuted && (
                        <Badge variant="outline">
                          Active
                        </Badge>
                      )}
                  </div>
                </td>
                <td className="px-4 py-4 text-right sm:px-6">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={
                        busyId === user.id
                      }
                      onClick={() =>
                        patch(user.id, {
                          isMuted:
                            !user.isMuted,
                        })
                      }
                    >
                      {user.isMuted
                        ? "Unmute"
                        : "Mute"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        user.isBlocked
                          ? "secondary"
                          : "destructive"
                      }
                      disabled={
                        busyId === user.id
                      }
                      onClick={() =>
                        patch(user.id, {
                          isBlocked:
                            !user.isBlocked,
                        })
                      }
                    >
                      {user.isBlocked
                        ? "Unblock"
                        : "Block"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
