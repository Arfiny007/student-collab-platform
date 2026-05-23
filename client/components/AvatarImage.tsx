"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { DEFAULT_AVATAR, getAvatarUrl } from "@/lib/media";

type AvatarImageProps = {
  src?: string | null;
  userId?: number | string;
  alt?: string;
  size?: number;
  className?: string;
  priority?: boolean;
};

export default function AvatarImage({
  src,
  userId,
  alt = "",
  size = 48,
  className,
  priority = false,
}: AvatarImageProps) {
  const resolved =
    getAvatarUrl(src, userId) || DEFAULT_AVATAR;

  return (
    <Image
      src={resolved}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      priority={priority}
      className={cn(
        "rounded-full object-cover bg-muted",
        className,
      )}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src !== DEFAULT_AVATAR) {
          img.src = DEFAULT_AVATAR;
        }
      }}
    />
  );
}
