"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import API from "../../lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthShell from "../auth/components/AuthShell";
import AuthFormField from "../auth/components/AuthFormField";
import PasswordField from "../auth/components/PasswordField";

type FormState = {
  email: string;
  password: string;
  username: string;
  phone: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    username: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const next: FormErrors = {};
    if (!form.username.trim()) next.username = "Username is required";
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.phone.trim()) next.phone = "Phone is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      console.log("FORM DATA:", form);
      await API.post("/users/register", form);
      toast.success("Registered successfully");
      router.push("/login");
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data &&
        typeof (err.response.data as { message?: string }).message === "string"
          ? (err.response.data as { message: string }).message
          : "Error";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join your campus community in a few steps."
      brandingDescription="Build, collaborate, and grow with students and mentors in one secure academic hub."
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleRegister} className="space-y-4" noValidate>
        <AuthFormField
          name="username"
          label="Username"
          placeholder="your_username"
          autoComplete="username"
          value={form.username}
          required
          error={errors.username}
          onChange={handleChange}
        />

        <AuthFormField
          name="email"
          type="email"
          label="Email"
          placeholder="you@university.edu"
          autoComplete="email"
          value={form.email}
          required
          error={errors.email}
          onChange={handleChange}
        />

        <AuthFormField
          name="phone"
          type="tel"
          label="Phone"
          placeholder="+1 555 000 0000"
          autoComplete="tel"
          value={form.phone}
          required
          error={errors.phone}
          onChange={handleChange}
        />

        <PasswordField
          name="password"
          label="Password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          value={form.password}
          required
          error={errors.password}
          onChange={handleChange}
        />

        <Button
          type="submit"
          variant="brand"
          size="lg"
          disabled={loading}
          className="mt-2 h-11 w-full"
          aria-busy={loading}
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
