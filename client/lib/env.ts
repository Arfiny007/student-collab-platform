/** Centralized public environment URLs (no localhost in components). */

function trimTrailingSlash(url: string) {
  return url.replace(/\/+$/, "");
}

let warnedMissingApiUrl = false;

function warnMissingApiUrl() {
  if (warnedMissingApiUrl) return;
  warnedMissingApiUrl = true;
  if (typeof window === "undefined") return;
  console.warn(
    "[ClassCircle] NEXT_PUBLIC_API_URL is not set. API requests will fail.",
  );
}

export function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) return trimTrailingSlash(url);
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000";
  }
  if (typeof window !== "undefined") {
    warnMissingApiUrl();
  }
  return "";
}

export function getSocketUrl(): string {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (url) return trimTrailingSlash(url);
  return getApiUrl();
}
