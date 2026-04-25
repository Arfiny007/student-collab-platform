"use client";

import { useState } from "react";
import API from "../../../lib/api";

export default function CreatePostModal({ onClose, refresh }: any) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);

 

  const handleCreate = async () => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("content", content);

  if (file) {
    formData.append("image", file);
  }

  await API.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  refresh();
  onClose();
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
        <input
  type="file"
  onChange={(e) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  }}
/>
{preview && (
  <img
    src={preview}
    className="w-full rounded-lg mt-3"
  />
)}

        

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