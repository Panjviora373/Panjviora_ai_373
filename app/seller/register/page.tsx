
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
      throw new Error(
        data.msg ||
          data.message ||
          data.error_description ||
          "Authentication failed"
      );
    }

    if (data.access_token) {
      setToken(data.access_token);
      setMessage(
        mode === "login"
          ? "Login successful! Now complete your seller registration."
          : "Account created successfully! Now complete your seller registration."
      );
      return;
    }

    if (mode === "signup" && (data.id || data.user?.id)) {
      setMessage(
        "Account created! Please check your email for confirmation, then login."
      );
      setMode("login");
      return;
    }

    throw new Error(
      "No access token received. Please confirm your email or try logging in."
    );
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

  const inputClass =
    "w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10";

  return (
    <main className="min-h-screen bg-[#f7f8f2] px-5 py-10 text-slate-800">
      <div className="mx-auto max-w-5xl">
        <nav className="flex items-center justify-between">
          <a href="/" className="text-3xl font-black tracking-tight text-emerald-900">
            ALIQO<span className="text-amber-500">.</span>
          </a>

          <a
            href="/"
            className="rounded-full border border-emerald-900/20 px-5 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-900 hover:text-white"
          >
            ← Back to Home
          </a>
        </nav>

        <div className="mt-12 grid overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-xl shadow-emerald-950/5 md:grid-cols-2">
          <section className="relative overflow-hidden bg-emerald-950 p-8 text-white md:p-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-amber-400/20" />
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-amber-400/20" />

            <span className="inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold tracking-widest text-amber-300">
              ALIQO SELLER PROGRAM
            </span>

            <h1 className="mt-9 text-4xl font-black leading-tight md:text-5xl">
              Grow Your
              <span className="block text-amber-400">Business With ALIQO</span>
            </h1>

            <p className="mt-6 leading-8 text-emerald-100/80">
              Join our growing marketplace. Create your seller account,
              introduce your products and reach more customers.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-xl font-bold text-emerald-950">1</span>
                <div>
                  <h3 className="font-bold text-white">Free Registration</h3>
                  <p className="mt-1 text-sm text-emerald-100/70">
                    No seller account registration fee.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-xl font-bold text-emerald-950">2</span>
                <div>
                  <h3 className="font-bold text-white">Admin Approval</h3>
                  <p className="mt-1 text-sm text-emerald-100/70">
                    Your application will be reviewed by ALIQO.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-xl font-bold text-emerald-950">3</span>
                <div>
                  <h3 className="font-bold text-white">Start Selling</h3>
                  <p className="mt-1 text-sm text-emerald-100/70">
                    Product selling tools will be available after approval
                    and launch.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 rounded-2xl border border-amber-400/25 bg-white/5 p-5">
              <p className="text-sm font-semibold text-amber-300">
                ALIQO PROPOSED COMMISSION
              </p>
              <p className="mt-2 text-4xl font-black text-white">5%</p>
              <p className="mt-2 text-sm text-emerald-100/70">
                On completed sales only. No commission on cancelled or
                refunded orders.
              </p>
            </div>
          </section>

          <section className="p-7 md:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
                Seller Account
              </p>

              <h2 className="mt-2 text-3xl font-black text-emerald-950">
                {token ? "Business Information" : "Join ALIQO Today"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {token
                  ? "Complete your business details to submit your seller application."
                  : "Create your account or login to continue."}
              </p>
            </div>

            {message && (
              <div className="mt-6 rounded-xl border border-emerald-700/20 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                {message}
              </div>
            )}

            {!token ? (
              <>
                <div className="mt-8 grid grid-cols-2 rounded-xl bg-emerald-50 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setMessage("");
                    }}
                    className={`rounded-lg py-3 text-sm font-bold transition ${
                      mode === "signup"
                        ? "bg-emerald-900 text-white shadow"
                        : "text-emerald-900 hover:bg-white"
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
                    className={`rounded-lg py-3 text-sm font-bold transition ${
                      mode === "login"
                        ? "bg-emerald-900 text-white shadow"
                        : "text-emerald-900 hover:bg-white"
                    }`}
                  >
                    Login
                  </button>
                </div>

                <form onSubmit={handleAuth} className="mt-7 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <button
                    disabled={loading}
                    className="w-full rounded-xl bg-emerald-900 py-4 font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800 disabled:opacity-50"
                  >
                    {loading
                      ? "Please wait..."
                      : mode === "signup"
                        ? "Create Seller Account →"
                        : "Login to Continue →"}
                  </button>
                </form>
              </>
            ) : (
              <form
                onSubmit={handleRegistration}
                className="mt-7 space-y-4"
              >
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Business Name
                  </label>
                  <input
                    required
                    placeholder="Your business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Owner Full Name
                  </label>
                  <input
                    required
                    placeholder="Your full name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="03XX XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Business Category
                  </label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Food">Food</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    City
                  </label>
                  <input
                    required
                    placeholder="Your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <button
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-900 py-4 font-bold text-white shadow-lg transition hover:bg-emerald-800 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Seller Application →"}
                </button>
              </form>
            )}

            <div className="mt-7 border-t border-slate-100 pt-5 text-center">
              <p className="text-xs leading-6 text-slate-500">
                Registration is free. The proposed 5% commission applies
                only to completed sales. Selling features will be enabled
                after approval and launch.
              </p>
              <p className="mt-4 text-sm font-bold text-emerald-900">
                ALIQO — Discover More. Do More.
              </p>
            </div>
          </section>
        </div>

        <footer className="py-8 text-center text-sm text-slate-500">
          © 2026 ALIQO. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
