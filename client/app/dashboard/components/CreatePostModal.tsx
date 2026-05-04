"use client";

import { useState } from "react";
import API from "../../../lib/api";

export default function CreatePostModal({
  onClose,
  refresh,
}: any) {
  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const [file, setFile] =
    useState<any>(null);

  const [preview, setPreview] =
    useState<string | null>(
      null,
    );

  const [fileName, setFileName] =
    useState("");

  const [options, setOptions] =
    useState<string[]>([
      "",
      "",
    ]);

  const addOption =
    () => {
      setOptions([
        ...options,
        "",
      ]);
    };

  const handleFileChange = (
    e: any,
  ) => {
    const selected =
      e.target.files?.[0];

    if (!selected) return;

    setFile(selected);

    setFileName(
      selected.name,
    );

    if (
      selected.type.startsWith(
        "image",
      )
    ) {
      setPreview(
        URL.createObjectURL(
          selected,
        ),
      );
    } else {
      setPreview(
        null,
      );
    }
  };

  const handleCreate =
    async () => {
      const formData =
        new FormData();

      formData.append(
        "title",
        title,
      );

      formData.append(
        "content",
        content,
      );

      if (file) {
        formData.append(
          "file",
          file,
        );
      }

      const cleanOptions =
        options.filter(
          (o) =>
            o.trim() !== "",
        );

      if (
        cleanOptions.length >
        0
      ) {
        formData.append(
          "options",
          JSON.stringify(
            cleanOptions,
          ),
        );
      }

      // 🔥 IMPORTANT
      const res =
        await API.post(
          "/posts",
          formData,
        );

      // 🔥 IMPORTANT
      refresh(
        res.data,
      );

      onClose();
    };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-3xl p-6 w-[500px] shadow-2xl">

        <h2 className="text-2xl font-bold mb-4">
          Create Post
        </h2>

        <input
          placeholder="Title"
          className="w-full border p-3 rounded-xl mb-3"
          onChange={(e) =>
            setTitle(
              e.target.value,
            )
          }
        />

        <textarea
          placeholder="Content"
          className="w-full border p-3 rounded-xl mb-4"
          onChange={(e) =>
            setContent(
              e.target.value,
            )
          }
        />

        <h3 className="font-semibold mb-2">
          Poll
        </h3>

        {options.map(
          (
            opt,
            i,
          ) => (
            <input
              key={i}
              className="w-full border p-2 rounded-xl mb-2"
              placeholder={`Option ${
                i + 1
              }`}
              onChange={(
                e,
              ) => {
                const arr =
                  [
                    ...options,
                  ];

                arr[
                  i
                ] =
                  e.target.value;

                setOptions(
                  arr,
                );
              }}
            />
          ),
        )}

        <button
          onClick={
            addOption
          }
          className="text-blue-600 mb-4"
        >
          + Add Option
        </button>

        <input
          type="file"
          onChange={
            handleFileChange
          }
        />

        {preview && (
          <img
            src={
              preview
            }
            className="rounded-xl mt-3"
          />
        )}

        {!preview &&
          fileName && (
            <p className="mt-2 text-sm">
              📄{" "}
              {
                fileName
              }
            </p>
          )}

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={
              onClose
            }
          >
            Cancel
          </button>

          <button
            onClick={
              handleCreate
            }
            className="bg-blue-600 text-white px-5 py-2 rounded-xl"
          >
            Post
          </button>

        </div>

      </div>

    </div>
  );
}