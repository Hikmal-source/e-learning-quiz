"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (!password) {
      return {
        score: 0,
        label: "",
      };
    }

    if (score <= 2) {
      return {
        score,
        label: "Weak",
      };
    }

    if (score <= 4) {
      return {
        score,
        label: "Medium",
      };
    }

    return {
      score,
      label: "Strong",
    };
  }, [password]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      setSuccess("Registration successful. You can now login.");

      setName("");
      setEmail("");
      setPassword("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const passwordRequirements = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One number",
      valid: /[0-9]/.test(password),
    },
    {
      label: "One special character",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
        <div className="w-full">
          {/* Header */}
          <div className="text-center">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-primary"
            >
              DevLearn
            </Link>

            <h1 className="mt-8 text-3xl font-bold tracking-tight text-text-primary">
              Create your account
            </h1>

            <p className="mt-3 text-sm text-text-secondary">
              Start your DevOps learning journey with DevLearn.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-sm"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Hikmal"
                autoComplete="name"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text-primary"
                >
                  Password
                </label>

                {passwordStrength.label && (
                  <span
                    className={`text-xs font-semibold ${passwordStrength.label === "Strong"
                        ? "text-success"
                        : passwordStrength.label === "Medium"
                          ? "text-warning"
                          : "text-danger"
                      }`}
                  >
                    {passwordStrength.label}
                  </span>
                )}
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a strong password"
                autoComplete="new-password"
                required
                minLength={8}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              {/* Strength Bar */}
              {password && (
                <div className="mt-3 flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${level <= passwordStrength.score
                          ? passwordStrength.label === "Strong"
                            ? "bg-success"
                            : passwordStrength.label === "Medium"
                              ? "bg-warning"
                              : "bg-danger"
                          : "bg-border"
                        }`}
                    />
                  ))}
                </div>
              )}

              {/* Requirements */}
              {password && (
                <div className="mt-3 grid grid-cols-1 gap-1.5">
                  {passwordRequirements.map((requirement) => (
                    <div
                      key={requirement.label}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className={
                          requirement.valid
                            ? "text-success"
                            : "text-text-muted"
                        }
                      >
                        {requirement.valid ? "✓" : "○"}
                      </span>

                      <span
                        className={
                          requirement.valid
                            ? "text-text-secondary"
                            : "text-text-muted"
                        }
                      >
                        {requirement.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger"
              >
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div
                role="status"
                className="rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success"
              >
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary transition hover:text-primary-hover"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}