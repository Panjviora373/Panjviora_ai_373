
"use client";

import { useEffect, useState } from "react";

type ApprovedAd = {
  id: number;
  business_name: string;
  advertising_details: string;
  created_at: string;
};

export default function AdvertisementsPage() {
  const [ads, setAds] = useState<ApprovedAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAds() {
      try {
        const response = await fetch("/api/ads");
        if (!response.ok) return;

        const data = await response.json();
        setAds(Array.isArray(data.ads) ? data.ads : []);
      } catch {
        setAds([]);
      } finally {
        setLoading(false);
      }
    }

    loadAds();
  }, []);

  return (
    <main className="min-h-screen bg-[#F3F6F1] text-[#10271D]">
      <header className="border-b border-[#D9E2D8] bg-[#10271D] px-5 py-5 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="text-2xl font-black">
            ALI<span className="text-[#E4C35D]">QO</span>
          </a>
          <a href="/advertise" className="rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-bold text-[#10271D]">
            Advertise With Us
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A17C26]">
            ALIQO BUSINESS PARTNERS
          </p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            Featured Advertisements
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#647468]">
            Discover businesses and services featured on ALIQO.
          </p>
        </div>

        {loading ? (
          <p className="py-12 text-center font-semibold">
            Loading advertisements...
          </p>
        ) : ads.length === 0 ? (
          <div className="rounded-3xl border border-[#D9E2D8] bg-white p-10 text-center">
            <h2 className="text-xl font-bold">No advertisements yet</h2>
            <p className="mt-3 text-sm text-[#647468]">
              Approved business advertisements will appear here.
            </p>
            <a href="/advertise" className="mt-6 inline-flex rounded-full bg-[#173B2B] px-6 py-3 text-sm font-bold text-[#F3D77C]">
              Submit Your Advertisement
            </a>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad) => (
              <article
                key={ad.id}
                className="rounded-3xl border border-[#D9E2D8] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#C49A32] hover:shadow-xl"
              >
                <span className="inline-flex rounded-full bg-[#F7F0D9] px-3 py-1 text-xs font-bold text-[#85631B]">
                  Featured Business
                </span>

                <h2 className="mt-5 text-xl font-extrabold text-[#173B2B]">
                  {ad.business_name}
                </h2>

                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-[#647468]">
                  {ad.advertising_details}
                </p>

                <div className="mt-6 border-t border-[#E5EBE3] pt-4 text-xs text-[#829084]">
                  Featured on ALIQO
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-[#090F0B] px-5 py-8 text-center text-sm text-[#A9B7AA]">
        © 2026 ALIQO. All rights reserved.
      </footer>
    </main>
  );
}
