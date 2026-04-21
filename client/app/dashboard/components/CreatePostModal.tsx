"use client";

import { useState } from "react";
import API from "../../../lib/api";

export default function CreatePostModal({ onClose, refresh }: any) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreate = async () => {
    try {
      await API.post("/posts", { title, content });
      refresh();
      onClose();
    } catch {
      alert("Failed to create post");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-[400px]">
        <h2 className="text-xl mb-4 font-bold">Create Post</h2>

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 mb-4 rounded"
          placeholder="Content"
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleCreate}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}