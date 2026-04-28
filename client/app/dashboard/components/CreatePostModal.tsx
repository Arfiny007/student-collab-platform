"use client";

import { useState } from "react";
import API from "../../../lib/api";

export default function CreatePostModal({ onClose, refresh }: any) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState(false);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);

    if (selectedFile.type.startsWith("image")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleCreate = async () => {
    if (!title && !content) {
      alert("Post cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      if (file) {
        formData.append("file", file);
      }

      const validOptions = options.filter((opt) => opt.trim() !== "");

      if (validOptions.length >= 2) {
        formData.append("options", JSON.stringify(validOptions));
      }

      // ✅ CORRECT API CALL
      const res = await API.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ ADD NEW POST TO FEED (INSTANT UX)
      refresh(res.data);

      onClose();
    } catch (err) {
      console.error("Post failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-[450px] p-6 shadow-2xl">

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          ✨ Create Post
        </h2>

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Post title..."
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 mb-4 rounded"
          placeholder="What's on your mind?"
          onChange={(e) => setContent(e.target.value)}
        />

        {/* POLL */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">📊 Poll</h3>

          {options.map((opt, i) => (
            <input
              key={i}
              className="w-full border p-2 mb-2"
              placeholder={`Option ${i + 1}`}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[i] = e.target.value;
                setOptions(newOptions);
              }}
            />
          ))}

          <button onClick={addOption} className="text-blue-500 text-sm">
            + Add option
          </button>
        </div>

        {/* FILE */}
        <input type="file" onChange={handleFileChange} />

        {preview && (
          <img src={preview} className="w-full mt-3 rounded" />
        )}

        {!preview && fileName && (
          <p className="mt-2 text-sm">📄 {fileName}</p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}>Cancel</button>

          <button
            disabled={loading}
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Posting..." : "Post 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}