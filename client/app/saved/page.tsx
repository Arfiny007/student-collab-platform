"use client";

import {
  useEffect,
  useState,
} from "react";

import API from "../../lib/api";

import PostCard from "../dashboard/components/PostCard";

export default function SavedPage() {
  const [posts, setPosts] =
    useState<any[]>([]);

  useEffect(() => {
    API.get(
      "/users/saved",
    ).then(
      (
        res,
      ) =>
        setPosts(
          res.data,
        ),
    );
  }, []);

  return (
    <div className="min-h-screen p-10 bg-gray-100 dark:bg-gray-950">

      <h1 className="text-5xl font-bold mb-10">
        Saved Posts
      </h1>

      {posts.length ===
        0 && (
        <div className="text-gray-400 text-xl">
          No saved posts
        </div>
      )}

      {posts.map(
        (
          post,
        ) => (
          <PostCard
            key={
              post.id
            }
            post={
              post
            }
          />
        ),
      )}

    </div>
  );
}