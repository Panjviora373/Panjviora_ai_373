
"use client";

import { useState } from "react";

export default function AdvertisePage() {
  const [business, setBusiness] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const inputStyle =
    "w-full rounded-xl border border-emerald-100 bg-white p-4 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/advertising_requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            business_name: business,
            contact_name: name,
            email,
            phone,
            advertising_details: message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSuccess(
        "Your advertising request has been submitted successfully. Our team will contact you by email."
      );

      setBusiness("");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-emerald-50 text-slate-800">
      <nav className="border-b border-emerald-900/10 bg-white px-6 py-5 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a
            href="/"
            className="text-3xl font-extrabold tracking-wide text-emerald-900"
          >
            ALIQO<span className="text-[#D4AF37]">.</span>
          </a>

          <a
            href="/"
            className="rounded-full border border-emerald-800 px-5 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-900 hover:text-white"
          >
            Home
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <span className="inline-block rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-5 py-2 text-xs font-bold tracking-[0.2em] text-emerald-900">
            ALIQO BUSINESS PARTNERS
          </span>

          <h1 className="mt-6 text-4xl font-extrabold text-emerald-950 md:text-6xl">
            Advertise with{" "}
            <span className="text-[#B08D23]">ALIQO</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Promote your business, reach new customers and grow your
            brand with ALIQO advertising.
          </p>

          <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-[#D4AF37]" />
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {/* Advertising Benefits */}

          <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-lg shadow-emerald-900/5 md:p-10">
            <div className="inline-flex rounded-xl bg-emerald-50 p-3 text-3xl">
              🌍
            </div>

            <h2 className="mt-5 text-2xl font-bold text-emerald-950">
              Why advertise with ALIQO?
            </h2>

            <div className="mt-8 space-y-7">
              <div>
                <h3 className="font-bold text-emerald-800">
                  Sponsored Search Results
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Promote your business in clearly labeled sponsored
                  search placements.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-emerald-800">
                  Featured Business
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Showcase your business name, website and services
                  to potential customers.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-emerald-800">
                  Custom Advertising
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Discuss advertising options and pricing directly
                  with our team.
                </p>
              </div>
            </div>

            <div className="mt-9 rounded-2xl border border-[#D4AF37]/40 bg-emerald-50 p-6">
              <h3 className="text-lg font-bold text-emerald-950">
                Contact ALIQO
              </h3>

              <a
                href="mailto:aliqo37311011@gmail.com"
                className="mt-4 block break-all font-semibold text-emerald-700 hover:text-emerald-900"
              >
                aliqo37311011@gmail.com
              </a>
            </div>
          </div>

          {/* Advertising Form */}

          <div className="rounded-3xl border border-[#D4AF37]/40 bg-white p-8 shadow-lg shadow-emerald-900/5 md:p-10">
            <div className="mb-7">
              <span className="text-sm font-bold tracking-widest text-[#B08D23]">
                PARTNER WITH US
              </span>

              <h2 className="mt-2 text-2xl font-extrabold text-emerald-950">
                Advertising Request
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Tell us about your business. Our team will discuss
                suitable advertising options with you.
              </p>
            </div>

            {success && (
              <div
                role="status"
                className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-800"
              >
                {success}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                required
                maxLength={150}
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder="Business Name"
                className={inputStyle}
              />

              <input
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className={inputStyle}
              />

              <input
                required
                type="email"
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className={inputStyle}
              />

              <input
                required
                type="tel"
                maxLength={30}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className={inputStyle}
              />

              <textarea
                required
                maxLength={3000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your advertising needs"
                rows={5}
                className={`${inputStyle} resize-y`}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-900 px-5 py-4 font-bold text-white shadow-md transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting Request..." : "Submit Advertising Request"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs leading-6 text-slate-500">
              Your information will be handled securely and used
              to respond to your advertising request.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm leading-7 text-slate-500">
            All paid placements will be clearly identified as
            Sponsored advertisements.
          </p>

          <p className="mt-3 font-bold tracking-widest text-emerald-900">
            ALIQO — One Platform. Endless Possibilities.
          </p>
        </div>
      </section>
    </main>
  );
}
