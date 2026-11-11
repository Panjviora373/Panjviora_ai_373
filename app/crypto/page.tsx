
"use client";

import Link from "next/link";

const partners = [
  {
    name: "Binance",
    description:
      "Explore Binance, one of the world's leading cryptocurrency exchanges, and discover its digital asset services.",
    website: "https://www.binance.com/",
  },
  {
    name: "Bybit",
    description:
      "Discover Bybit and explore its cryptocurrency exchange and digital finance services.",
    website: "https://www.bybit.com/",
  },
  {
    name: "OKX",
    description:
      "Explore OKX and learn about its cryptocurrency exchange and digital asset services.",
    website: "https://www.okx.com/",
  },
  {
    name: "Bitget",
    description:
      "Discover Bitget and explore its cryptocurrency exchange and digital asset services.",
    website: "https://www.bitget.com/",
  },
];

export default function CryptoPage() {
  return (
    <main className="min-h-screen bg-[#07130f] text-white">
      <header className="border-b border-[#c5a34a]/30 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold tracking-wide text-[#d6b65c]"
          >
            ALIQO
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-[#d6b65c] px-4 py-2 text-sm transition hover:bg-[#d6b65c] hover:text-black"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#d6b65c]">
          ALIQO Financial Hub
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
          Explore the World of{" "}
          <span className="text-[#d6b65c]">Crypto</span>
        </h1>

        <p className="mx-auto max-w-2xl text-base leading-8 text-gray-300">
          Discover cryptocurrency platforms, explore educational
          resources, and learn about digital finance. Compare
          platforms and make informed decisions before using
          any cryptocurrency service.
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-16 sm:grid-cols-2">
        {partners.map((partner) => (
          <article
            key={partner.name}
            className="rounded-2xl border border-[#c5a34a]/30 bg-[#10231a] p-8 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[#d6b65c]"
          >
            <h2 className="mb-4 text-2xl font-bold text-[#d6b65c]">
              {partner.name}
            </h2>

            <p className="mb-6 min-h-20 leading-7 text-gray-300">
              {partner.description}
            </p>

            <span className="mb-5 inline-block rounded-full border border-yellow-500/40 px-3 py-1 text-xs text-yellow-300">
              Affiliate partnership pending
            </span>

            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl bg-[#d6b65c] px-5 py-3 text-center font-semibold text-black transition hover:bg-[#edcf7c]"
            >
              Visit Official Website
            </a>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="rounded-2xl border border-white/10 bg-[#10231a] p-6">
          <h2 className="mb-3 text-xl font-bold text-[#d6b65c]">
            Important Risk Disclaimer
          </h2>

          <p className="text-sm leading-7 text-gray-300">
            Cryptocurrency involves significant financial risk.
            Prices can change rapidly, and you may lose some or
            all of your investment. ALIQO does not provide
            investment or financial advice. Always research
            platforms and understand the risks before making
            financial decisions.
          </p>
        </div>
      </section>

      <footer className="border-t border-[#c5a34a]/30 px-6 py-8 text-center text-sm text-gray-400">
        <p>© 2026 ALIQO. All rights reserved.</p>

        <p className="mt-2">
          Some links may become affiliate links in the future.
          Any such relationship will be disclosed clearly.
        </p>
      </footer>
    </main>
  );
}
