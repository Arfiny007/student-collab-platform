"use client";

import { useState } from "react";
import API from "../../lib/api";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    phone: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
        console.log("FORM DATA:", form);
      await API.post("/users/register", form);
      alert("Registered successfully");
      router.push("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="h-screen grid grid-cols-2">
      
      {/* LEFT SIDE (Branding) */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-purple-700 text-white p-10">
        <h1 className="text-4xl font-bold mb-4">
          Student Collab 🚀
        </h1>
        <p className="text-lg text-center max-w-md opacity-80">
          Build, collaborate and grow with developers worldwide.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-[400px]">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Create Account
          </h2>

          <input
            name="username"
            placeholder="Username"
            className="w-full p-3 border rounded-lg mb-3"
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg mb-3"
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            className="w-full p-3 border rounded-lg mb-3"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg mb-6"
            onChange={handleChange}
          />

          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Register
          </button>

        </div>
      </div>
    </div>
  );
}