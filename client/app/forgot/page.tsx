"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import API from "../../lib/api";
import toast from "react-hot-toast";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthShell from "../auth/components/AuthShell";
import AuthFormField from "../auth/components/AuthFormField";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    setError(undefined);
    return true;
  };

  const handleReset = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await API.post("/auth/forgot", { email });
      setSent(true);
      toast.success("Reset link sent (mock)");
    } catch {
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll send a recovery link to your email."
      footer={
        <p>
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      {sent ? (
        <div
          className="flex flex-col items-center gap-4 rounded-xl border border-border/60 bg-muted/40 px-4 py-8 text-center"
          role="status"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="size-5" aria-hidden="true" />
          </span>
          <p className="text-body text-foreground">
            Check your inbox for a reset link sent to{" "}
            <span className="font-medium">{email}</span>.
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setSent(false)}
          >
            Send again
          </Button>
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-5" noValidate>
          <AuthFormField
            id="forgot-email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@university.edu"
            autoComplete="email"
            value={email}
            required
            error={error}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(undefined);
            }}
          />

          <Button
            type="submit"
            variant="brand"
            size="lg"
            disabled={loading}
            className="h-11 w-full"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
