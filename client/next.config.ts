import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
let apiHostname = "";
try {
  if (apiUrl) apiHostname = new URL(apiUrl).hostname;
} catch {
  /* ignore invalid URL at build time */
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      ...(apiHostname
        ? [
            {
              protocol: "https" as const,
              hostname: apiHostname,
              pathname: "/**",
            },
            {
              protocol: "http" as const,
              hostname: apiHostname,
              pathname: "/**",
            },
          ]
        : [
            {
              protocol: "http" as const,
              hostname: "localhost",
              port: "5000",
              pathname: "/**",
            },
          ]),
    ],
  },
  poweredByHeader: false,
};

export default nextConfig;
