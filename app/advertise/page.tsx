
"use client";

import { useState } from "react";

export default function AdvertisePage() {
  const [business, setBusiness] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const contactMessage = `ALIQO Business Advertising Request

Business Name: ${business}
Contact Person: ${name}
Email: ${email}
Phone: ${phone}
Advertising Details: ${message}`;

  const whatsappLink = `https://wa.me/923363465838?text=${encodeURIComponent(contactMessage)}`;

  const emailLink = `mailto:aliqo37311011@gmail.com?subject=${encodeURIComponent(
    "ALIQO Advertising Request"
  )}&body=${encodeURIComponent(contactMessage)}`;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <p className="mb-4 text-sm font-semibold tracking-widest text-blue-400">
            ALIQO BUSINESS PARTNERS
          </p>

          <h1 className="text-4xl font-bold md:text-6xl">
            Advertise with <span className="text-blue-400">ALIQO</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Promote your business, reach new customers and grow your brand
            with ALIQO advertising.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold">Why advertise with ALIQO?</h2>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="font-semibold text-blue-400">
                  Sponsored Search Results
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Promote your business in clearly labeled sponsored search
                  placements.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-blue-400">
                  Featured Business
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Showcase your business name, website and services.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-blue-400">
                  Custom Advertising
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Discuss advertising options and pricing directly with
                  our team.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-slate-800 p-5">
              <p className="font-semibold">Contact ALIQO</p>

              <a
                href="https://wa.me/923363465838"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block text-green-400"
              >
                WhatsApp: +92 336 3465838
              </a>

              <a
                href="mailto:aliqo37311011@gmail.com"
                className="mt-3 block text-blue-400"
              >
                aliqo37311011@gmail.com
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold">
              Advertising Request
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Tell us about your business. We will discuss suitable
              advertising options with you.
            </p>

            <form
              className="mt-6 space-y-4"
              onSubmit={async (e) => {
  e.preventDefault();

  const whatsappWindow = window.open("", "_blank");

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

    if (whatsappWindow) {
      whatsappWindow.location.href = whatsappLink;
    }
  } catch (error) {
    whatsappWindow?.close();
    alert("Request save nahi hui. Please dobara try karein.");
  }
}}
            >
              <input
                required
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder="Business Name"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-blue-500"
              />

              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-blue-500"
              />

              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-blue-500"
              />

              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-blue-500"
              />

              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your advertising needs"
                rows={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-green-600 px-5 py-3 font-semibold hover:bg-green-700"
              >
                Send Request on WhatsApp
              </button>

              <a
                href={emailLink}
                className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold hover:bg-blue-700"
              >
                Send Request by Gmail
              </a>
            </form>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          All paid placements will be clearly identified as Sponsored
          advertisements.
        </p>
      </section>
    </main>
  );
}
