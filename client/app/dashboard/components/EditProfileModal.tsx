"use client";

import { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Camera,
  Globe,
  GraduationCap,
  Loader2,
  User,
  X,
} from "lucide-react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import API from "../../../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  bumpAvatarCacheVersion,
  getAvatarUrl,
} from "@/lib/media";

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
] as const;

const URL_FIELDS = new Set(["github", "linkedin", "portfolio"]);

function buildProfileFormData(
  form: Record<string, string>,
  avatar: File | null,
): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(form)) {
    const trimmed = value.trim();
    if (URL_FIELDS.has(key) && !trimmed) {
      continue;
    }
    formData.append(key, trimmed);
  }

  if (avatar) {
    formData.append("avatar", avatar);
  }

  return formData;
}

function getSaveErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string | string[] }
      | undefined;
    const msg = data?.message;
    if (Array.isArray(msg)) {
      return msg.join(". ");
    }
    if (typeof msg === "string") {
      return msg;
    }
    if (error.response?.status === 401) {
      return "Session expired. Please sign in again.";
    }
    if (error.code === "ERR_NETWORK") {
      return "Network error. Check your connection and try again.";
    }
  }
  return "Could not save profile. Please try again.";
}

export default function EditProfileModal({
  user,
  onClose,
  refresh,
}: {
  user: Record<string, string | number | null | undefined>;
  onClose: () => void;
  refresh: () => void | Promise<void>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewBlobRef = useRef<string | null>(null);
  const saveInFlightRef = useRef(false);
  const mountedRef = useRef(true);

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
    getAvatarUrl(
      String(user.avatar || ""),
      user.id ?? undefined,
    ) || null,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (previewBlobRef.current) {
        URL.revokeObjectURL(previewBlobRef.current);
        previewBlobRef.current = null;
      }
    };
  }, []);

  const handleClose = () => {
    if (saveInFlightRef.current) {
      return;
    }
    onClose();
  };

  const update = async () => {
    if (saveInFlightRef.current || saving) {
      return;
    }

    const trimmedUsername = form.username.trim();
    if (!trimmedUsername) {
      setError("Username is required.");
      return;
    }

    saveInFlightRef.current = true;
    setSaving(true);
    setError(null);

    try {
      const formData = buildProfileFormData(
        { ...form, username: trimmedUsername },
        avatar,
      );

      await API.patch("/users/me", formData);

      bumpAvatarCacheVersion();

      try {
        await Promise.resolve(refresh());
      } catch {
        toast.error(
          "Profile saved, but the page could not refresh. Reload if data looks stale.",
        );
      }

      if (mountedRef.current) {
        onClose();
      }
    } catch (err) {
      const message = getSaveErrorMessage(err);
      if (mountedRef.current) {
        setError(message);
      }
      toast.error(message);
    } finally {
      saveInFlightRef.current = false;
      if (mountedRef.current) {
        setSaving(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
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
            onClick={handleClose}
            disabled={saving}
            aria-label="Close edit profile"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <div className="mb-6 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
              className={cn(
                "group relative size-24 overflow-hidden rounded-full ring-2 ring-border/80",
                "transition-[transform,box-shadow] duration-[var(--duration-fast)]",
                "hover:ring-primary/50 active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-60",
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
              disabled={saving}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (previewBlobRef.current) {
                  URL.revokeObjectURL(previewBlobRef.current);
                }
                const blobUrl = URL.createObjectURL(file);
                previewBlobRef.current = blobUrl;
                setAvatar(file);
                setPreview(blobUrl);
                setError(null);
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
                          value={form[field.key]}
                          disabled={saving}
                          onChange={(e) => {
                            setError(null);
                            setForm((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }));
                          }}
                          rows={3}
                          placeholder="Tell the community about yourself…"
                          className={cn(
                            "flex w-full resize-none rounded-lg border border-input bg-background px-3 py-2",
                            "text-sm text-foreground shadow-xs outline-none",
                            "transition-[border-color,box-shadow] duration-200",
                            "placeholder:text-muted-foreground",
                            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40",
                            "disabled:cursor-not-allowed disabled:opacity-60",
                          )}
                        />
                      ) : (
                        <Input
                          id={`profile-${field.key}`}
                          type={field.type}
                          value={form[field.key]}
                          disabled={saving}
                          onChange={(e) => {
                            setError(null);
                            setForm((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }));
                          }}
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
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={saving}
          >
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
