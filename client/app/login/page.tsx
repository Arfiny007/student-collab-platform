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

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      login(res.data.access_token);

      const payload = JSON.parse(
        atob(res.data.access_token.split('.')[1])
      );
      localStorage.setItem("userId", payload.sub);

      router.push("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="h-screen grid grid-cols-2">
      
      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-700 text-white p-10">
        <h1 className="text-4xl font-bold mb-4">
          Student Collab 🚀
        </h1>
        <p className="text-lg opacity-80 text-center max-w-md">
          Collaborate, share ideas, and build projects with students worldwide.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-[380px]">

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Welcome Back
          </h2>

          <input
            className="w-full p-3 mb-4 border rounded-lg bg-black/20 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 mb-6 border rounded-lg bg-black/20 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Login
          </button>

          

          <p className="text-sm text-gray-500 mt-4 text-center">
  Don’t have an account? 
  <span
    onClick={() => router.push("/register")}
    className="text-blue-600 cursor-pointer ml-1"
  >
    Register
  </span>
</p>

        </div>
      </div>
    </div>
  );
}