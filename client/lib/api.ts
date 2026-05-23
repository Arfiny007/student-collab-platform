import axios, { AxiosError } from "axios";
import { getApiUrl } from "./env";

const API = axios.create({
  baseURL: getApiUrl(),
  timeout: 30000,
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

function isAuthEndpoint(url?: string) {
  if (!url) return false;
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register")
  );
}

API.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    const path = window.location.pathname;
    if (path.startsWith("/login") || path.startsWith("/register")) {
      return Promise.reject(error);
    }

    const requestUrl = error.config?.url ?? "";
    if (isAuthEndpoint(requestUrl)) {
      return Promise.reject(error);
    }

    const hadAuthHeader = Boolean(
      error.config?.headers?.Authorization,
    );
    if (!hadAuthHeader) {
      return Promise.reject(error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("chatUser");
    window.dispatchEvent(new Event("auth:session-expired"));

    return Promise.reject(error);
  },
);

export default API;
