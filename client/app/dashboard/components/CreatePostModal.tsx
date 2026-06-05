"use client";

import { useState, type ChangeEvent } from "react";
import {
  FileText,
  ImageUp,
  Paperclip,
  Plus,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import API from "../../../lib/api";

type CreatePostModalProps = {
  onClose: () => void;
  refresh: (post: unknown) => void;
};

export default function CreatePostModal({
  onClose,
  refresh,
}: CreatePostModalProps) {
  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

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
    e: ChangeEvent<HTMLInputElement>,
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
    try {
      if (
        !title.trim() &&
        !content.trim()
      ) {
        alert(
          "Post cannot be empty",
        );
        return;
      }

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

      if (
        file
      ) {
        if (
          file.size >
          10 *
            1024 *
            1024
        ) {
          alert(
            "File too large",
          );
          return;
        }

        formData.append(
          "file",
          file,
        );
      }

      const cleanOptions =
        options.filter(
          (
            o,
          ) =>
            o.trim() !==
            "",
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

      const res =
        await API.post(
          "/posts",
          formData,
        );

      refresh(
        res.data,
      );

      onClose();
    } catch {
      alert(
        "Failed to create post",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-6">
      <div
        className="glass-panel animate-scale-in flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border/80 shadow-elevated-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-post-title"
      >
        <div className="border-b border-border/70 px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-caption font-medium uppercase text-muted-foreground">
            ClassCircle
          </p>
          <h2
            id="create-post-title"
            className="text-title mt-1 text-foreground"
          >
            Create Post
          </h2>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          <section className="space-y-3">
            <label className="block space-y-2">
              <span className="text-caption font-medium text-muted-foreground">
                Title
              </span>
              <Input
                placeholder="Give your post a clear title"
                className="h-12 rounded-2xl border-border/80 bg-background/75 text-base shadow-sm focus-visible:shadow-glow-brand"
                onChange={(e) =>
                  setTitle(
                    e.target.value,
                  )
                }
              />
            </label>

            <label className="block space-y-2">
              <span className="text-caption font-medium text-muted-foreground">
                Content
              </span>
              <textarea
                placeholder="Share an update, question, resource, or announcement..."
                className="min-h-36 w-full resize-y rounded-2xl border border-input bg-background/75 px-4 py-3 text-body text-foreground shadow-sm outline-none transition-[border-color,box-shadow,background] duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-background focus-visible:ring-3 focus-visible:ring-ring/40"
                onChange={(e) =>
                  setContent(
                    e.target.value,
                  )
                }
              />
            </label>

            <div className="flex items-center justify-between gap-3 text-caption text-muted-foreground">
              <span>
                {content.length > 0
                  ? "Ready to publish"
                  : "Start with a thought"}
              </span>
              <span aria-live="polite">
                {content.length} characters
              </span>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-border/70 bg-background/45 p-4 shadow-xs">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Poll
              </h3>
              <p className="text-caption text-muted-foreground">
                Add choices when the post needs a quick vote.
              </p>
            </div>

            <div className="space-y-2.5">
              {options.map(
                (
                  opt,
                  i,
                ) => (
                  <label
                    key={i}
                    className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 px-3 py-2 shadow-xs transition-[border-color,box-shadow,background] duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-caption font-semibold text-muted-foreground transition-colors group-focus-within:bg-primary group-focus-within:text-primary-foreground">
                      {i + 1}
                    </span>
                    <input
                      className="h-9 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
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
                  </label>
                ),
              )}
            </div>

            <Button
              type="button"
              variant="glass"
              size="sm"
              onClick={
                addOption
              }
              className="interactive-lift w-full justify-center rounded-2xl border-border/70 sm:w-auto"
            >
              <Plus aria-hidden="true" />
              + Add option
            </Button>
          </section>

          <section className="space-y-3">
            <label className="block cursor-pointer rounded-2xl border border-dashed border-border/90 bg-background/45 p-4 text-center shadow-xs transition-[border-color,background,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] hover:border-primary/60 hover:bg-background/70 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/35">
              <span className="mx-auto flex size-10 items-center justify-center rounded-2xl bg-muted text-lg font-semibold text-muted-foreground">
                <Paperclip
                  aria-hidden="true"
                  className="size-5"
                />
              </span>
              <span className="mt-3 block text-sm font-medium text-foreground">
                Attach a file
              </span>
              <span className="mt-1 block text-caption text-muted-foreground">
                Choose an image or document up to 10 MB
              </span>
              <input
                type="file"
                onChange={
                  handleFileChange
                }
                className="sr-only"
              />
            </label>

            {preview && (
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/60 shadow-sm">
                <img
                  src={
                    preview
                  }
                  alt="Selected upload preview"
                  className="max-h-72 w-full object-cover"
                />
                <div className="border-t border-border/70 px-4 py-3 text-caption text-muted-foreground">
                  <ImageUp
                    aria-hidden="true"
                    className="mr-2 inline size-4 align-[-2px]"
                  />
                  {fileName}
                </div>
              </div>
            )}

            {!preview &&
              fileName && (
                <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-foreground shadow-sm">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-caption font-semibold text-muted-foreground">
                    <FileText
                      aria-hidden="true"
                      className="size-4"
                    />
                  </span>
                  <span className="min-w-0 truncate">
                    {
                      fileName
                    }
                  </span>
                </div>
              )}
          </section>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border/70 bg-background/55 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            variant="ghost"
            onClick={
              onClose
            }
            className="rounded-2xl"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="brand"
            onClick={
              handleCreate
            }
            className="interactive-lift rounded-2xl px-5"
          >
            <Send aria-hidden="true" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
