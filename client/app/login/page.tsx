"use client";

import { useState, useContext, FormEvent } from "react";
import Link from "next/link";
import API from "../../lib/api";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthShell from "../auth/components/AuthShell";
import AuthFormField from "../auth/components/AuthFormField";
import PasswordField from "../auth/components/PasswordField";

export default function Login() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = "Email is required";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", { email, password });

      const token = res.data.access_token;
      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("userId", payload.sub);
      login(token);

      router.push("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to your campus workspace."
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Create account
          </Link>
        </p>
      }
    >
      <form
        onSubmit={handleLogin}
        className="space-y-5"
        noValidate
      >
        <AuthFormField
          id="login-email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@university.edu"
          autoComplete="email"
          value={email}
          required
          error={errors.email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
        />

        <div className="space-y-2">
          <PasswordField
            id="login-password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            required
            error={errors.password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: undefined }));
            }}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot"
              className="text-caption font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Forgot password?
            </Link>
          </div>
        </div>

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
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
