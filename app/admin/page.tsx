
"use client";

import { useEffect, useState } from "react";

type Request = {
  id?: number | string;
  business_name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  advertising_details?: string;
  created_at?: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadRequests(accessToken: string) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      setError("Supabase environment variables are missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/advertising_requests?select=*`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedToken = sessionStorage.getItem("aliqo_admin_token");

    if (savedToken) {
      setToken(savedToken);
      loadRequests(savedToken);
    }
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      setError("Supabase environment variables are missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      sessionStorage.setItem("aliqo_admin_token", data.access_token);
      setToken(data.access_token);
      setPassword("");
      await loadRequests(data.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("aliqo_admin_token");
    setToken("");
    setRequests([]);
    setEmail("");
    setPassword("");
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold">
            ALIQO <span className="text-blue-400">Admin</span>
          </h1>
          <p className="mt-3 text-slate-400">
            Advertising Management Dashboard
          </p>
        </header>

        {!token ? (
          <form
            onSubmit={handleLogin}
            className="mx-auto max-w-md space-y-5 rounded-2xl border border-slate-700 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold">Admin Login</h2>

            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            />

            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            />

            {error && (
              <p className="break-words text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 p-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Secure Admin Login"}
            </button>
          </form>
        ) : (
          <section>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Advertising Requests</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Total requests: {requests.length}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => loadRequests(token)}
                  className="rounded-lg bg-blue-600 px-4 py-2 font-semibold"
                >
                  Refresh
                </button>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-600 px-4 py-2 font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>

            {error && (
              <p className="mb-5 break-words rounded-lg bg-red-950 p-4 text-red-300">
                {error}
              </p>
            )}

            {loading ? (
              <p className="text-slate-300">Loading requests...</p>
            ) : requests.length === 0 ? (
              <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
                No advertising requests found.
              </div>
            ) : (
              <div className="space-y-5">
                {requests.map((item, index) => (
                  <article
                    key={item.id ?? index}
                    className="rounded-xl border border-slate-700 bg-slate-900 p-6"
                  >
                    <h3 className="text-xl font-bold text-blue-400">
                      {item.business_name || "Business"}
                    </h3>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <p>
                        <span className="text-slate-400">Contact:</span>{" "}
                        {item.contact_name}
                      </p>
                      <p>
                        <span className="text-slate-400">Email:</span>{" "}
                        {item.email}
                      </p>
                      <p>
                        <span className="text-slate-400">Phone:</span>{" "}
                        {item.phone}
                      </p>
                    </div>

                    <div className="mt-4 rounded-lg bg-slate-800 p-4">
                      <p className="mb-2 font-semibold text-slate-300">
                        Advertising Details
                      </p>
                      <p className="whitespace-pre-wrap text-slate-400">
                        {item.advertising_details}
                      </p>
                    </div>

                    {item.created_at && (
                      <p className="mt-4 text-xs text-slate-500">
                        Submitted: {new Date(item.created_at).toLocaleString()}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
