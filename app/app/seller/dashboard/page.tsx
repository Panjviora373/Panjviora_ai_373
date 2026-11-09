
"use client";

import { useEffect, useState } from "react";

type Seller = {
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  category: string;
  city: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function SellerDashboard() {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  async function loadSeller(token: string) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Database configuration missing");
    }

    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!userResponse.ok) {
      throw new Error("Session expired. Please login again.");
    }

    const user = await userResponse.json();

    const response = await fetch(
      `${supabaseUrl}/rest/v1/sellers?user_id=eq.${encodeURIComponent(user.id)}&select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Unable to load seller information");
    }

    if (!data.length) {
      throw new Error("Seller account not found. Please register first.");
    }

    setSeller(data[0]);
    localStorage.setItem("aliqo_seller_token", token);
  }

  useEffect(() => {
    const savedToken = localStorage.getItem("aliqo_seller_token");

    if (savedToken) {
      loadSeller(savedToken).catch((error) => {
        localStorage.removeItem("aliqo_seller_token");
        setMessage(error.message);
      });
    }
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Database configuration missing");
      }

      const response = await fetch(
        `${supabaseUrl}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.access_token) {
        throw new Error(
          data.msg || data.message || "Invalid email or password"
        );
      }

      await loadSeller(data.access_token);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("aliqo_seller_token");
    setSeller(null);
    setPassword("");
    setMessage("You have been logged out.");
  }

  const statusText = {
    pending: "Waiting for Admin Approval",
    approved: "Your Seller Account is Approved",
    rejected: "Your Seller Application was Rejected",
  };

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-3xl font-bold text-emerald-400">
          ALIQO
        </a>

        {!seller ? (
          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-white/10 bg-slate-900 p-8">
            <h1 className="text-3xl font-bold">Seller Login</h1>
            <p className="mt-3 text-slate-400">
              Login to access your ALIQO Seller Dashboard.
            </p>

            {message && (
              <p className="mt-5 rounded-lg bg-red-500/10 p-3 text-sm text-red-300">
                {message}
              </p>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-slate-800 p-3 outline-none"
              />

              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-slate-800 p-3 outline-none"
              />

              <button
                disabled={loading}
                className="w-full rounded-lg bg-emerald-500 py-3 font-bold text-slate-950 disabled:opacity-50"
              >
                {loading ? "Please wait..." : "Login to Dashboard"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-400">
              New seller?{" "}
              <a
                href="/seller/register"
                className="text-emerald-400"
              >
                Register here
              </a>
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Seller Dashboard</h1>
                <p className="mt-2 text-slate-400">
                  Welcome, {seller.owner_name}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-lg border border-white/20 px-5 py-2 hover:bg-white/10"
              >
                Logout
              </button>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-xl font-bold">Business Information</h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-400">Business Name</p>
                  <p className="mt-1 font-semibold">{seller.business_name}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Owner Name</p>
                  <p className="mt-1 font-semibold">{seller.owner_name}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="mt-1 font-semibold">{seller.email}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Phone</p>
                  <p className="mt-1 font-semibold">{seller.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Category</p>
                  <p className="mt-1 font-semibold">{seller.category}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">City</p>
                  <p className="mt-1 font-semibold">{seller.city}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-xl font-bold">Account Status</h2>

              <p className="mt-3 font-semibold text-emerald-400">
                {statusText[seller.status]}
              </p>

              {seller.status === "pending" && (
                <p className="mt-2 text-sm text-slate-400">
                  Your application is under review. You can add products
                  after approval.
                </p>
              )}

              {seller.status === "approved" && (
                <p className="mt-2 text-sm text-slate-400">
                  Your account is approved. Product selling features
                  will be available as they are added to ALIQO.
                </p>
              )}

              {seller.status === "rejected" && (
                <p className="mt-2 text-sm text-slate-400">
                  Please contact ALIQO support for further assistance.
                </p>
              )}
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
                <h3 className="text-lg font-bold">Products</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Product management is coming soon.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
                <h3 className="text-lg font-bold">ALIQO Commission</h3>
                <p className="mt-2 text-3xl font-bold text-emerald-400">
                  5%
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Proposed commission on completed sales only.
                </p>
              </div>
            </div>
          </>
        )}

        <p className="mt-10 text-center text-sm text-slate-500">
          © ALIQO. All rights reserved.
        </p>
      </div>
    </main>
  );
}
