"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  MoreHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  hidePost,
  type AdminPost,
} from "@/lib/adminApi";
import { cn } from "@/lib/utils";

export default function ModerationTable({
  items,
  onUpdated,
}: {
  items: AdminPost[];
  onUpdated: () => void;
}) {
  const [busyId, setBusyId] = useState<
    number | null
  >(null);

  const toggleHide = async (
    post: AdminPost,
  ) => {
    setBusyId(post.id);
    try {
      await hidePost(post.id);
      toast.success(
        post.hidden
          ? "Post restored"
          : "Post hidden",
      );
      onUpdated();
    } catch {
      toast.error("Action failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div
      className={cn(
        "glass-panel overflow-hidden rounded-2xl border border-border/60",
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-caption uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium sm:px-6">
                Post
              </th>
              <th className="px-4 py-3 font-medium">
                Author
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
            {items.map((post) => (
              <tr
                key={post.id}
                className="transition-colors hover:bg-muted/20"
              >
                <td className="max-w-xs px-4 py-4 sm:px-6">
                  <p className="font-medium text-foreground line-clamp-1">
                    {post.title ||
                      "Untitled"}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-caption text-muted-foreground">
                    {post.content}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <span className="font-medium text-foreground">
                    {post.author
                      ?.username ??
                      "Unknown"}
                  </span>
                </td>
                <td className="px-4 py-4 tabular-nums">
                  <span
                    className={cn(
                      "font-semibold",
                      post.reports > 0
                        ? "text-destructive"
                        : "text-muted-foreground",
                    )}
                  >
                    {post.reports}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {post.hidden ? (
                    <Badge variant="secondary">
                      Hidden
                    </Badge>
                  ) : post.reports > 0 ? (
                    <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/20">
                      Flagged
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      OK
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-4 text-right sm:px-6">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={
                      busyId === post.id
                    }
                    className="gap-1.5"
                    onClick={() =>
                      toggleHide(post)
                    }
                  >
                    {post.hidden ? (
                      <Eye className="size-3.5" />
                    ) : (
                      <EyeOff className="size-3.5" />
                    )}
                    {post.hidden
                      ? "Restore"
                      : "Hide"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && (
        <p className="flex items-center justify-center gap-2 px-6 py-10 text-muted-foreground">
          <MoreHorizontal
            className="size-4"
            aria-hidden
          />
          Queue is clear
        </p>
      )}
    </div>
  );
}
