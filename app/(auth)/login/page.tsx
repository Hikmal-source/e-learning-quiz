"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  function validateForm() {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      return "Email is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return "Please enter a valid email address.";
    }

    if (!password) {
      return "Password is required.";
    }

    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      console.log("AUTH RESULT:", result);

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }
      const sessionResponse = await fetch("/api/auth/session", {
        cache: "no-store",
      });
      const session = await sessionResponse.json();

      if (session?.user?.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
        <div className="w-full">
          <div className="text-center">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-primary"
            >
              DevLearn
            </Link>

            <h1 className="mt-8 text-3xl font-bold tracking-tight text-text-primary">
              Welcome back
            </h1>

            <p className="mt-3 text-sm text-text-secondary">
              Continue your DevOps learning journey.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-sm"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Email
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text-primary"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary transition hover:text-primary-hover"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-12 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface-muted hover:text-text-primary"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary transition hover:text-primary-hover"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}