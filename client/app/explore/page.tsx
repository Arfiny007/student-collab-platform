"use client";

import {
  useEffect,
  useState,
} from "react";

import API from "../../lib/api";

import PostCard from "../dashboard/components/PostCard";

export default function ExplorePage() {
  const [posts, setPosts] =
    useState<any[]>([]);

  const [tags, setTags] =
    useState<any[]>([]);

  useEffect(() => {
    API.get(
      "/posts/explore",
    ).then(
      (
        res,
      ) =>
        setPosts(
          res.data,
        ),
    );

    API.get(
      "/posts/trending",
    ).then(
      (
        res,
      ) =>
        setTags(
          res.data,
        ),
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-10">

      <h1 className="text-5xl font-bold mb-10">
        Explore
      </h1>

      {/* TAGS */}
      <div className="flex gap-3 mb-10 flex-wrap">

        {tags.map(
          (
            tag,
          ) => (
            <div
              key={
                tag[0]
              }
              className="px-5 py-2 rounded-full bg-blue-100 dark:bg-gray-800 font-medium"
            >
              {
                tag[0]
              }
            </div>
          ),
        )}

      </div>

      {/* POSTS */}
      <div className="grid grid-cols-2 gap-8">

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

    </div>
  );
}