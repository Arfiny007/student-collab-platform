"use client";

import CommentSection from "./CommentSection";
import API from "../../../lib/api";
import { useState } from "react";

export default function PostCard({ post }: any) {
  // ✅ REAL STATE FROM BACKEND
  const [count, setCount] = useState(post.likeCount || 0);
  const [liked, setLiked] = useState(post.liked || false);

  // ✅ REAL TOGGLE FUNCTION
  const toggleLike = async () => {
    try {
      const res = await API.patch(`/posts/${post.id}/toggle-like`);

      setLiked(res.data.liked);
      setCount(res.data.count);
    } catch (err) {
      console.log("Like error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-4 border">

      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {post.title}
      </h3>

      <p className="text-gray-600 mb-3">
        {post.content}
      </p>

      <div className="text-sm text-gray-400 mb-3">
        Posted by {post.author?.email}
      </div>

      {/* ❤️ LIKE BUTTON (ONLY ONE SYSTEM) */}
      <button
        onClick={toggleLike}
        className={`mb-3 flex items-center gap-2 ${
          liked ? "text-red-500" : "text-gray-500"
        }`}
      >
        ❤️ {count}
      </button>

      <CommentSection postId={post.id} />
    </div>
  );
}