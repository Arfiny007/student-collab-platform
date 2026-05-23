import { getApiUrl } from "./env";

const AVATAR_SESSION_KEY = "avatarCacheVersion";

/** Bump cache version on login/logout so avatars refresh across accounts. */
export function bumpAvatarCacheVersion() {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    AVATAR_SESSION_KEY,
    String(Date.now()),
  );
}

function getAvatarCacheVersion(): string {
  if (typeof window === "undefined") return "0";
  return localStorage.getItem(AVATAR_SESSION_KEY) || "0";
}

/** Resolve uploaded asset path to absolute URL with optional cache busting. */
export function getMediaUrl(
  path?: string | null,
  options?: { bust?: boolean; userId?: number | string },
): string | null {
  if (!path) return null;
  const base = getApiUrl();
  if (!base) return null;

  const normalized = path.startsWith("http")
    ? path
    : `${base}/${path.replace(/^\/+/, "")}`;

  if (!options?.bust) return normalized;

  const version = getAvatarCacheVersion();
  const key = options.userId != null ? `${options.userId}-` : "";
  const sep = normalized.includes("?") ? "&" : "?";
  return `${normalized}${sep}v=${key}${encodeURIComponent(path)}-${version}`;
}

export function getAvatarUrl(
  avatar?: string | null,
  userId?: number | string,
): string | null {
  return getMediaUrl(avatar, { bust: true, userId });
}

export const DEFAULT_AVATAR =
  "https://placehold.co/100x100/e2e8f0/64748b?text=User";
