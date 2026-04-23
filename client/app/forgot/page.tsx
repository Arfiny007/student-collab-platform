"use client";

import { useState } from "react";
import API from "../../lib/api";

export default function Forgot() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    try {
      await API.post("/auth/forgot", { email });
      alert("Reset link sent (mock)");
    } catch {
      alert("Error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-[350px]">
        <h2 className="text-xl mb-4 font-bold">Forgot Password</h2>

        <input
          placeholder="Enter your email"
          className="w-full p-3 border rounded mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-blue-600 text-white py-3 rounded"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}