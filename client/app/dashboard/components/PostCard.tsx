"use client";

import CommentSection from "./CommentSection";
import API from "../../../lib/api";
import { useState } from "react";

export default function PostCard({ post }: any) {
  const [likes, setLikes] = useState(post.likes || 0);

  const likePost = async () => {
    await API.patch(`/posts/${post.id}/like`);
    setLikes((prev: number) => prev + 1);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border mb-6">
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {post.title}
      </h3>

      <p className="text-gray-600 mb-3">
        {post.content}
      </p>

      <div className="text-sm text-gray-400 mb-3">
        Posted by {post.author?.email}
      </div>

      {/* 👍 LIKE BUTTON */}
      <button
        onClick={likePost}
        className="text-blue-600 font-medium mb-3"
      >
        👍 {likes} Likes
      </button>

      <CommentSection postId={post.id} />
    </div>
  );
}