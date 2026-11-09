
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function SubmitDealPage() {
  const [form, setForm] = useState({
    business_name: "",
    contact_name: "",
    email: "",
    title: "",
    description: "",
    category: "Shopping",
    offer_url: "",
    valid_until: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function updateField(name: string, value: string) {
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to submit your offer.");
      }

      setSuccess(true);
      setMessage("Your offer has been submitted successfully! It will appear after admin approval.");

      setForm({
        business_name: "",
        contact_name: "",
        email: "",
        title: "",
        description: "",
        category: "Shopping",
        offer_url: "",
        valid_until: "",
      });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#D9E2D8] bg-white px-4 py-3 text-sm text-[#18271D] outline-none transition focus:border-[#B9953B] focus:ring-2 focus:ring-[#D4AF37]/20";

  return (
    <main className="min-h-screen bg-[#F3F6F1] text-[#18271D]">
      <nav className="border-b border-white/10 bg-[#10271D] px-5 py-5 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-2xl font-black">
            ALI<span className="text-[#E4C35D]">QO</span>
          </Link>

          <Link
            href="/deals"
            className="rounded-full border border-[#D4AF37]/50 px-5 py-2 text-sm font-bold text-[#E4C35D]"
          >
            View Deals
          </Link>
        </div>
      </nav>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <span className="text-xs font-bold tracking-[0.25em] text-[#A17C26]">
              GROW WITH ALIQO
            </span>

            <h1 className="mt-4 text-4xl font-black text-[#10271D] sm:text-5xl">
              Submit Your Deal
            </h1>

            <p className="mt-4 leading-7 text-[#647468]">
              Share your special offers with the ALIQO community.
              Your offer will be reviewed before it goes live.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[#D9E2D8] bg-white p-6 shadow-lg sm:p-9"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-bold text-[#173B2B]">
                Business Name *
                <input
                  required
                  minLength={2}
                  maxLength={150}
                  className={inputClass}
                  value={form.business_name}
                  onChange={(e) => updateField("business_name", e.target.value)}
                  placeholder="Your business name"
                />
              </label>

              <label className="text-sm font-bold text-[#173B2B]">
                Contact Person *
                <input
                  required
                  minLength={2}
                  maxLength={100}
                  className={inputClass}
                  value={form.contact_name}
                  onChange={(e) => updateField("contact_name", e.target.value)}
                  placeholder="Your full name"
                />
              </label>
            </div>

            <label className="mt-5 block text-sm font-bold text-[#173B2B]">
              Email Address *
              <input
                required
                type="email"
                maxLength={254}
                className={inputClass}
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label className="mt-5 block text-sm font-bold text-[#173B2B]">
              Deal Title *
              <input
                required
                minLength={3}
                maxLength={150}
                className={inputClass}
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Example: 20% discount on all products"
              />
            </label>

            <label className="mt-5 block text-sm font-bold text-[#173B2B]">
              Deal Category *
              <select
                required
                className={inputClass}
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
              >
                <option>Shopping</option>
                <option>Technology</option>
                <option>Education</option>
                <option>Lifestyle</option>
                <option>Fashion</option>
                <option>Food</option>
                <option>Travel</option>
                <option>Other</option>
              </select>
            </label>

            <label className="mt-5 block text-sm font-bold text-[#173B2B]">
              Deal Description *
              <textarea
                required
                minLength={5}
                maxLength={2000}
                rows={5}
                className={inputClass}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your offer, discount and conditions..."
              />
            </label>

            <label className="mt-5 block text-sm font-bold text-[#173B2B]">
              Offer Website (Optional)
              <input
                type="url"
                className={inputClass}
                value={form.offer_url}
                onChange={(e) => updateField("offer_url", e.target.value)}
                placeholder="https://example.com"
              />
            </label>

            <label className="mt-5 block text-sm font-bold text-[#173B2B]">
              Offer Valid Until (Optional)
              <input
                type="date"
                                className={inputClass}
                value={form.valid_until}
                onChange={(e) => updateField("valid_until", e.target.value)}
              />
            </label>

            {message && (
              <div
                className={`mt-6 rounded-xl p-4 text-sm font-medium ${
                  success
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-700"
                }`}
                role="status"
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 w-full rounded-full bg-[#173B2B] px-6 py-4 font-bold text-white shadow-lg transition hover:bg-[#24543C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Your Deal →"}
            </button>

            <p className="mt-5 text-center text-xs leading-6 text-[#829084]">
              Submissions are reviewed by ALIQO before publication.
            </p>
          </form>
        </div>
      </section>

      <footer className="bg-[#10271D] px-5 py-8 text-center text-sm text-[#C4D0C5]">
        © 2026 ALIQO. All rights reserved.
      </footer>
    </main>
  );
}
