"use client";

import CommentSection from "./CommentSection";
import API from "../../../lib/api";
import { useEffect, useState } from "react";

export default function PostCard({ post }: any) {
  const [count, setCount] = useState(post.likeCount || 0);
  const [liked, setLiked] = useState(post.liked || false);

  const toggleLike = async () => {
    const res = await API.patch(`/posts/${post.id}/toggle-like`);
    setLiked(res.data.liked);
    setCount(res.data.count);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border p-5 mb-6 hover:shadow-lg transition">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          {post.author?.email[0].toUpperCase()}
        </div>

        <div>
          <p className="font-semibold text-gray-800">
            {post.author?.email}
          </p>
          <p className="text-xs text-gray-400">
            Just now
          </p>
        </div>
      </div>

      {/* TITLE */}
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        {post.title}
      </h2>

      {/* CONTENT */}
      <p className="text-gray-600 mb-3">{post.content}</p>

      {/* IMAGE */}
      {post.image && (
        <img
          src={`http://localhost:5000/${post.image}`}
          className="w-full rounded-xl mb-3 object-cover max-h-[400px]"
        />
      )}

      {/* ACTIONS */}
      <div className="flex items-center justify-between mt-3 border-t pt-3">

        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 font-medium transition ${
            liked ? "text-red-500" : "text-gray-500 hover:text-red-400"
          }`}
        >
          ❤️ {count}
        </button>

        <span className="text-sm text-gray-400">
          Comments below
        </span>
      </div>

      <CommentSection postId={post.id} />
    </div>
  );
}