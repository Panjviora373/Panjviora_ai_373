"use client";

import { useState } from "react";

export default function SellerRegisterPage() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  async function handleAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Database configuration missing");
      }

      const url =
        mode === "signup"
          ? `${supabaseUrl}/auth/v1/signup`
          : `${supabaseUrl}/auth/v1/token?grant_type=password`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.message || data.error_description || "Authentication failed");
      }

      if (!data.access_token) {
        setMessage(
          "Account created! Please verify your email, then return here and login."
        );
        setMode("login");
        return;
      }

      setToken(data.access_token);
      setMessage("Login successful! Now complete your seller registration.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRegistration(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/sellers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          business_name: businessName,
          owner_name: ownerName,
          phone,
          category,
          city,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setMessage(
        "Congratulations! Your seller application has been submitted and is waiting for admin approval."
      );
      setBusinessName("");
      setOwnerName("");
      setPhone("");
      setCategory("");
      setCity("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-white">
      <div className="mx-auto max-w-xl">
        <a href="/" className="text-3xl font-bold text-emerald-400">
          ALIQO
        </a>

        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-7 shadow-xl">
          <h1 className="text-3xl font-bold">
            Become an ALIQO Seller
          </h1>

          <p className="mt-3 text-slate-400">
            Create your seller account and start your journey with ALIQO.
            Registration is free.
          </p>

          {message && (
            <div className="mt-5 rounded-lg bg-emerald-500/10 p-4 text-sm text-emerald-300">
              {message}
            </div>
          )}

          {!token ? (
            <>
              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setMessage("");
                  }}
                  className={`flex-1 rounded-lg py-3 font-semibold ${
                    mode === "signup"
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-800 text-white"
                  }`}
                >
                  Create Account
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setMessage("");
                  }}
                  className={`flex-1 rounded-lg py-3 font-semibold ${
                    mode === "login"
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-800 text-white"
                  }`}
                >
                  Login
                </button>
              </div>

              <form onSubmit={handleAuth} className="mt-6 space-y-4">
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-800 p-3 outline-none focus:border-emerald-400"
                />

                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Password (minimum 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-800 p-3 outline-none focus:border-emerald-400"
                />

                <button
                  disabled={loading}
                  className="w-full rounded-lg bg-emerald-500 py-3 font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
                >
                  {loading
                    ? "Please wait..."
                    : mode === "signup"
                      ? "Create Seller Account"
                      : "Login"}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleRegistration} className="mt-7 space-y-4">
              <h2 className="text-xl font-bold text-emerald-400">
                Business Information
              </h2>

              <input
                required
                placeholder="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-800 p-3 outline-none focus:border-emerald-400"
              />

              <input
                required
                placeholder="Owner Full Name"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-800 p-3 outline-none focus:border-emerald-400"
              />

              <input
                required
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-800 p-3 outline-none focus:border-emerald-400"
              />

              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-800 p-3 text-white"
              >
                <option value="">Select Business Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Food">Food</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Beauty">Beauty</option>
                <option value="Other">Other</option>
              </select>

              <input
                required
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-800 p-3 outline-none focus:border-emerald-400"
              />

              <button
                disabled={loading}
                className="w-full rounded-lg bg-emerald-500 py-3 font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Seller Application"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-400">
            Seller registration is free. ALIQO's proposed commission is 5%
            on completed sales.
          </p>
        </div>
      </div>
    </main>
  );
}
