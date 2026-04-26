"use client";

import { createContext, useState, useEffect } from "react";

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

export function AuthProvider({ children }: any) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setTokenState(stored);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setTokenState(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}