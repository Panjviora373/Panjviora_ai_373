
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("Verifying your reset link...");
  const [loading, setLoading] = useState(false);
  const [validLink, setValidLink] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    async function verifyLink() {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const token = params.get("access_token");
      const error = params.get("error_description");

      if (error) {
        setMessage(decodeURIComponent(error.replace(/\+/g, " ")));
        return;
      }

      if (!token) {
        setMessage(
          "Reset link is missing or expired. Please request a new password reset email."
        );
        return;
      }

      if (!supabaseUrl || !supabaseKey) {
        setMessage("Supabase configuration is missing.");
        return;
      }

      try {
        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setMessage("This reset link is invalid or expired. Request a new one.");
          return;
        }

        setAccessToken(token);
        setValidLink(true);
        setMessage("Please enter your new password below.");
      } catch {
        setMessage("Unable to verify the reset link. Please try again.");
      }
    }

    verifyLink();
  }, [supabaseUrl, supabaseKey]);

  async function handleReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey!,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.msg || "Password update failed.");
      }

      setMessage("Password updated successfully! Redirecting to seller login...");

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/seller/register");
      }, 2500);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-white">
          ALIQO
        </h1>

        <h2 className="mb-6 text-center text-xl font-semibold text-white">
          Reset Your Password
        </h2>

        <p className="mb-5 text-center text-sm text-gray-300">
          {message}
        </p>

        {validLink && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-200">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-600 bg-gray-800 p-3 text-white outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-200">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-600 bg-gray-800 p-3 text-white outline-none focus:border-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 p-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-gray-500">
          ALIQO - Your Smart Discovery Platform
        </p>
      </div>
    </main>
  );
}
