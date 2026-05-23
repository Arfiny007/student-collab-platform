"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import type { ComponentProps } from "react";

type AuthFormFieldProps = ComponentProps<"input"> & {
  label: string;
  error?: string;
  hint?: string;
};

export default function AuthFormField({
  label,
  error,
  hint,
  id,
  className,
  required,
  ...props
}: AuthFormFieldProps) {
  const fieldId = id ?? props.name;
  const errorId = error && fieldId ? `${fieldId}-error` : undefined;
  const hintId = hint && fieldId ? `${fieldId}-hint` : undefined;

  return (
    <div className="space-y-2">
      <label
        htmlFor={fieldId}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>

      <Input
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [errorId, hintId].filter(Boolean).join(" ") || undefined
        }
        className={cn(
          "h-11 bg-background/80",
          error && "border-destructive focus-visible:ring-destructive/25",
          className,
        )}
        {...props}
      />

      {hint && !error && (
        <p id={hintId} className="text-caption text-muted-foreground">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-caption text-destructive"
        >
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
