const DEV_FALLBACK = "supersecret";

/** Shared JWT secret — fails fast in production when unset. */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET is required when NODE_ENV=production",
    );
  }

  return DEV_FALLBACK;
}
