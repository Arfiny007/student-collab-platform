"use client";

import {
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { bumpAvatarCacheVersion } from "@/lib/media";
import { connectSocket, resetSocket } from "@/lib/socket";

type AuthType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthType>({
  token: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setTokenState] = useState<string | null>(null);

  const syncTokenFromStorage = useCallback(() => {
    setTokenState(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    syncTokenFromStorage();

    const onSessionExpired = () => syncTokenFromStorage();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") {
        syncTokenFromStorage();
      }
    };

    window.addEventListener("auth:session-expired", onSessionExpired);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(
        "auth:session-expired",
        onSessionExpired,
      );
      window.removeEventListener("storage", onStorage);
    };
  }, [syncTokenFromStorage]);

  useEffect(() => {
    if (token) {
      connectSocket();
    } else {
      resetSocket();
    }
  }, [token]);

  const login = (newToken: string) => {
    bumpAvatarCacheVersion();
    resetSocket();
    localStorage.setItem("token", newToken);
    setTokenState(newToken);
    connectSocket();
  };

  const logout = () => {
    bumpAvatarCacheVersion();
    resetSocket();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("chatUser");
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
