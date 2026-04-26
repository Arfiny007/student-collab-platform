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

    await API.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setLoading(false);
    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-[450px] p-6 shadow-2xl animate-fadeIn">

        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          ✨ Create Post
        </h2>

        {/* TITLE */}
        <input
          className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-2 mb-3 rounded-lg outline-none"
          placeholder="Post title..."
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* CONTENT */}
        <textarea
          className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-2 mb-4 rounded-lg outline-none"
          placeholder="What's on your mind?"
          rows={3}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* 📊 POLL SECTION */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">
            📊 Add Poll (optional)
          </h3>

          {options.map((opt, i) => (
            <input
              key={i}
              className="w-full border border-gray-200 focus:border-blue-500 p-2 mb-2 rounded-lg"
              placeholder={`Option ${i + 1}`}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[i] = e.target.value;
                setOptions(newOptions);
              }}
            />
          ))}

          <button
            onClick={addOption}
            className="text-blue-600 text-sm hover:underline"
          >
            + Add option
          </button>
        </div>

        {/* 📁 FILE UPLOAD */}
        <div className="mb-4">
          <label className="block border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition">
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />

            <p className="text-gray-500 text-sm">
              📎 Click to upload image or file
            </p>
          </label>

          {/* IMAGE PREVIEW */}
          {preview && (
            <img
              src={preview}
              className="w-full rounded-xl mt-3 shadow"
            />
          )}

          {/* FILE NAME */}
          {!preview && fileName && (
            <p className="mt-2 text-sm text-gray-600">
              📄 {fileName}
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}