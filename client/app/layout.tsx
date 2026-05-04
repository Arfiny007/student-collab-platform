import "./globals.css";

import { Toaster } from "react-hot-toast";

import {
  AuthProvider,
} from "../context/AuthContext";

import FloatingMessenger from "./dashboard/components/FloatingMessenger";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <body>

        <AuthProvider>

          <Toaster />

          {children}

          <FloatingMessenger />

        </AuthProvider>

      </body>

    </html>
  );
}