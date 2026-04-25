"use client";

import { useEffect, useState } from "react";
import API from "../../../lib/api";

export default function CommentSection({ postId }: any) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  

  const loadComments = async () => {
    const res = await API.get(`/comments/${postId}`);
    setComments(res.data);
  };

  useEffect(() => {
    loadComments();
  }, []);

  const addComment = async () => {
  if (!text.trim()) {
    alert("Comment cannot be empty");
    return;
  }

  await API.post("/comments", {
    content: text,
    postId: postId, // ✅ explicit
  });

  setText("");
  loadComments();
};

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Comments</h4>

      {comments.map((c: any) => (
        <div key={c.id} className="bg-gray-100 p-2 rounded mb-2">
  <p className="text-xs text-gray-500">{c.author?.email}</p>
  <p className="text-sm text-gray-800">{c.content}</p>
</div>
      ))}

      <div className="flex gap-2 mt-2">
        <input
          className="border p-2 flex-1 rounded focus:ring-2 focus:ring-blue-400"
          placeholder="Write comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          onClick={addComment}
        >
          Send
        </button>
      </div>
    </div>
  );
}