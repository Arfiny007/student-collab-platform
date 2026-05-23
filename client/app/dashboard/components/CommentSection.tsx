"use client";

import { useEffect, useState } from "react";
import API from "../../../lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const loadComments = async () => {
    const res = await API.get(`/comments/${postId}`);
    setComments(res.data);
  };

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    API.get(`/comments/${postId}`)
      .then((res) => {
        if (!cancelled) {
          setComments(res.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setComments([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [postId]);

  const addComment = async () => {
    try {
      if (!text.trim()) {
        return;
      }

      await API.post("/comments", {
        content: text,
        postId,
      });

      setText("");
      await loadComments();
    } catch {
      alert("Failed to comment");
    }
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Comments</h4>

      {loading && (
        <div className="space-y-2 mb-3" aria-busy="true" aria-label="Loading comments">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      )}

      {!loading &&
        comments.map((c: any) => (
          <div key={c.id} className="bg-gray-100 dark:bg-muted/50 p-2 rounded mb-2">
            <p className="text-xs text-gray-500 dark:text-muted-foreground">
              {c.author?.email}
            </p>
            <p className="text-sm text-gray-800 dark:text-foreground">{c.content}</p>
          </div>
        ))}

      <div className="flex gap-2 mt-2">
        <input
          className="border border-border bg-background p-2 flex-1 rounded focus:ring-2 focus:ring-ring/50"
          placeholder="Write comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Comment text"
        />
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          onClick={addComment}
        >
          Send
        </button>
      </div>
    </div>
  );
}
