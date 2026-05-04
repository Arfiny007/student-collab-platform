"use client";

import { useState } from "react";
import API from "../../../lib/api";

export default function EditProfileModal({
  user,
  onClose,
  refresh,
}: any) {
  const [form, setForm] = useState({
    username: user.username || "",
    bio: user.bio || "",
    university: user.university || "",
    department: user.department || "",
    location: user.location || "",
    github: user.github || "",
    linkedin: user.linkedin || "",
    portfolio: user.portfolio || "",
    skills: user.skills || "",
  });

  const [avatar, setAvatar] =
    useState<any>(null);

  const [preview, setPreview] =
    useState<string | null>(
      user.avatar
        ? `http://localhost:5000/${user.avatar}`
        : null,
    );

  const update = async () => {
    const formData = new FormData();

    Object.entries(form).forEach(
      ([key, value]) => {
        formData.append(
          key,
          value as string,
        );
      },
    );

    if (avatar) {
      formData.append(
        "avatar",
        avatar,
      );
    }

    await API.patch(
      "/users/me",
      formData,
    );

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white rounded-3xl w-[600px] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">

        <h2 className="text-2xl font-bold mb-5">
          Edit Profile
        </h2>

        <input
          type="file"
          onChange={(e) => {
            const file =
              e.target.files?.[0];

            if (!file) return;

            setAvatar(file);

            setPreview(
              URL.createObjectURL(
                file,
              ),
            );
          }}
        />

        {preview && (
          <img
            src={preview}
            className="w-24 h-24 rounded-full mt-3 object-cover"
          />
        )}

        {Object.keys(form).map(
          (key) => (
            <input
              key={key}
              value={
                form[
                  key as keyof typeof form
                ]
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  [key]:
                    e.target.value,
                })
              }
              placeholder={key}
              className="w-full border p-3 rounded-xl mt-3"
            />
          ),
        )}

        <div className="flex justify-end gap-3 mt-5">

          <button
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            onClick={update}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}