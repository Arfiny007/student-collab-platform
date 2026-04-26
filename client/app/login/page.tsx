"use client";

import { useState, useContext } from "react";
import API from "../../lib/api";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", { email, password });

      const token = res.data.access_token;

      // ✅ IMPORTANT FIX (this was missing reliability)
      localStorage.setItem("token", token);

      // decode user id
      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("userId", payload.sub);

      // context login
      login(token);

      router.push("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white p-10">
        <h1 className="text-5xl font-bold mb-6">
          StudentHub 🚀
        </h1>
        <p className="text-lg opacity-90 text-center max-w-md">
          Connect, collaborate, and build amazing projects with students worldwide.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-[380px]">

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Welcome Back 👋
          </h2>

          {/* EMAIL */}
          <input
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <input
            type="password"
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* REGISTER */}
          <p className="text-sm text-gray-500 mt-5 text-center">
            Don’t have an account?
            <span
              onClick={() => router.push("/register")}
              className="text-blue-600 cursor-pointer ml-1 hover:underline"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}