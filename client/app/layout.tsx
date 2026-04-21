import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "../context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
            <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}