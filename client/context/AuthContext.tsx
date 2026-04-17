"use client";

import { createContext, useState } from "react";
import { setToken } from "../lib/api";


type UserType = {
  token: string;
} | null;

export const AuthContext = createContext<any>(null);

export default function AuthProvider({ children }: any) {
  const [user, setUser] = useState<UserType>(null);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);

    
    setUser({ token });
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
}