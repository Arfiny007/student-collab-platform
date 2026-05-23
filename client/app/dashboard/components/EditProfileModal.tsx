"use client";

import { useRef, useState } from "react";
import {
  Briefcase,
  Camera,
  Globe,
  GraduationCap,
  Loader2,
  User,
  X,
} from "lucide-react";
import API from "../../../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FIELD_SECTIONS = [
  {
    title: "Basic info",
    icon: User,
    fields: [
      { key: "username", label: "Username", type: "text" as const },
      { key: "bio", label: "Bio", type: "textarea" as const },
    ],
  },
  {
    title: "Education & location",
    icon: GraduationCap,
    fields: [
      { key: "university", label: "University", type: "text" as const },
      { key: "department", label: "Department", type: "text" as const },
      { key: "location", label: "Location", type: "text" as const },
    ],
  },
  {
    title: "Social links",
    icon: Globe,
    fields: [
      { key: "github", label: "GitHub URL", type: "url" as const },
      { key: "linkedin", label: "LinkedIn URL", type: "url" as const },
      { key: "portfolio", label: "Portfolio URL", type: "url" as const },
    ],
  },
  {
    title: "Skills",
    icon: Briefcase,
    fields: [
      {
        key: "skills",
        label: "Skills (comma-separated)",
        type: "text" as const,
        placeholder: "React, TypeScript, Design",
      },
    ],
  },
];

export default function EditProfileModal({
  user,
  onClose,
  refresh,
}: {
  user: Record<string, string | number | null | undefined>;
  onClose: () => void;
  refresh: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    username: String(user.username || ""),
    bio: String(user.bio || ""),
    university: String(user.university || ""),
    department: String(user.department || ""),
    location: String(user.location || ""),
    github: String(user.github || ""),
    linkedin: String(user.linkedin || ""),
    portfolio: String(user.portfolio || ""),
    skills: String(user.skills || ""),
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    user.avatar ? `${API_BASE}/${user.avatar}` : null,
  );
  const [saving, setSaving] = useState(false);

  const update = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (avatar) {
        formData.append("avatar", avatar);
      }
      await API.patch("/users/me", formData);
      refresh();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={cn(
          "glass-panel shadow-elevated-lg animate-scale-in",
          "flex max-h-[min(90vh,720px)] w-full max-w-xl flex-col overflow-hidden rounded-3xl",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <h2 id="edit-profile-title" className="text-title">
            Edit Profile
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close edit profile"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-6 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "group relative size-24 overflow-hidden rounded-full ring-2 ring-border/80",
                "transition-[transform,box-shadow] duration-[var(--duration-fast)]",
                "hover:ring-primary/50 active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              aria-label="Change profile photo"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-muted">
                  <User className="size-10 text-muted-foreground" />
                </div>
              )}
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center bg-black/45 opacity-0",
                  "transition-opacity duration-[var(--duration-fast)] group-hover:opacity-100",
                )}
              >
                <Camera className="size-6 text-white" />
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setAvatar(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
            <p className="text-caption text-muted-foreground">
              Click to upload a new photo
            </p>
          </div>

          <div className="space-y-6">
            {FIELD_SECTIONS.map((section) => (
              <section key={section.title}>
                <div className="mb-3 flex items-center gap-2">
                  <section.icon
                    className="size-4 text-primary"
                    aria-hidden
                  />
                  <h3 className="text-sm font-medium text-foreground">
                    {section.title}
                  </h3>
                </div>
                <div className="space-y-3">
                  {section.fields.map((field) => (
                    <div key={field.key}>
                      <label
                        htmlFor={`profile-${field.key}`}
                        className="mb-1.5 block text-caption font-medium text-muted-foreground"
                      >
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          id={`profile-${field.key}`}
                          value={form[field.key as keyof typeof form]}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              [field.key]: e.target.value,
                            })
                          }
                          rows={3}
                          placeholder="Tell the community about yourself…"
                          className={cn(
                            "flex w-full resize-none rounded-lg border border-input bg-background px-3 py-2",
                            "text-sm text-foreground shadow-xs outline-none",
                            "transition-[border-color,box-shadow] duration-200",
                            "placeholder:text-muted-foreground",
                            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40",
                          )}
                        />
                      ) : (
                        <Input
                          id={`profile-${field.key}`}
                          type={field.type}
                          value={form[field.key as keyof typeof form]}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              [field.key]: e.target.value,
                            })
                          }
                          placeholder={
                            "placeholder" in field
                              ? field.placeholder
                              : field.label
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border/60 px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="brand"
            onClick={update}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}