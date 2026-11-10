
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("Verifying your recovery link...");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    async function verifyLink() {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get("access_token");
      const error = params.get("error_description");

      if (error) {
        setMessage(error);
        return;
      }

      if (!supabaseUrl || !supabaseKey || !accessToken) {
        setMessage("Invalid or expired recovery link. Please request a new email.");
        return;
      }

      try {
        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Your recovery link is invalid or expired.");
        }

        localStorage.setItem("aliqo_recovery_token", accessToken);
        setReady(true);
        setMessage("Choose your new password.");
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Unable to verify link."
        );
      }
    }

    verifyLink();
  }, [supabaseUrl, supabaseKey]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const token = localStorage.getItem("aliqo_recovery_token");

    if (!token || !supabaseUrl || !supabaseKey) {
      setMessage("Recovery session expired. Please request a new email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.message || "Password update failed.");
      }

      localStorage.removeItem("aliqo_recovery_token");
      setMessage("Password updated successfully! You can now login.");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => router.push("/seller/register"), 2000);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8f2] px-5 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <a href="/" className="text-3xl font-black text-emerald-900">
          ALIQO<span className="text-amber-500">.</span>
        </a>

        <h1 className="mt-8 text-3xl font-black text-emerald-950">
          Reset Your Password
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          Enter and confirm your new account password.
        </p>

        {message && (
          <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
            {message}
          </div>
        )}

        {ready && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <input
              type="password"
              required
              minLength={6}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border p-4 outline-none focus:border-emerald-700"
            />

            <input
              type="password"
              required
              minLength={6}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border p-4 outline-none focus:border-emerald-700"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-900 py-4 font-bold text-white disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        <a
          href="/seller/register"
          className="mt-7 block text-center text-sm font-semibold text-emerald-900"
        >
          Back to Seller Login
        </a>
      </div>
    </main>
  );
}
