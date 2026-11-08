
import Link from "next/link";

const features = [
  {
    title: "Web Search",
    description:
      "Explore websites, discover useful information, and find relevant content from across the internet.",
  },
  {
    title: "Image Search",
    description:
      "Discover images and visual content to explore ideas, creativity, and inspiration.",
  },
  {
    title: "Video Search",
    description:
      "Find and explore videos from YouTube through one convenient search experience.",
  },
  {
    title: "AI-Powered Search",
    description:
      "Explore AI-assisted answers and insights to make information discovery more convenient.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050b08] text-white">
      <nav className="border-b border-[#d6b45b]/20 px-6 py-5">
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-wide text-[#d6b45b]"
        >
          ALIQO
        </Link>
      </nav>

      <header className="px-6 py-20 text-center sm:py-28">
        <p className="mb-4 font-semibold tracking-[0.3em] text-[#d6b45b]">
          DISCOVER ALIQO
        </p>

        <h1 className="text-4xl font-extrabold sm:text-6xl">
          About <span className="text-[#d6b45b]">ALIQO</span>
        </h1>

        <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300">
          Welcome to ALIQO — a modern search and discovery platform
          designed to bring web search, images, videos, and
          AI-assisted discovery together in one convenient place.
        </p>

        <p className="mt-6 text-xl font-semibold text-[#d6b45b]">
          Discover More. Search Smarter.
        </p>
      </header>

      <article className="mx-auto max-w-6xl px-6 pb-20">
        <section className="mb-16">
          <h2 className="mb-5 text-3xl font-bold text-[#d6b45b]">
            What Makes ALIQO Different?
          </h2>

          <p className="max-w-4xl leading-8 text-slate-300">
            ALIQO brings different ways of discovering information
            together in one platform. Instead of limiting users
            to one type of search, we aim to make exploring
            information, visual content, videos, and AI-assisted
            insights easier and more convenient.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-[#d6b45b]">
            Explore ALIQO Features
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-[#d6b45b]/20 bg-[#0c1711] p-7 transition hover:border-[#d6b45b]/60"
              >
                <h3 className="mb-3 text-xl font-bold text-[#d6b45b]">
                  {feature.title}
                </h3>

                <p className="leading-7 text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-2xl border border-[#d6b45b]/30 bg-[#0c1711] p-8 sm:p-10">
          <p className="mb-3 font-semibold tracking-widest text-[#d6b45b]">
            BUSINESS WITH ALIQO
          </p>

          <h2 className="mb-5 text-3xl font-bold">
            Advertising & Business Opportunities
          </h2>

          <p className="mb-6 leading-8 text-slate-300">
            ALIQO also aims to create opportunities for businesses,
            brands, startups, and entrepreneurs. We welcome
            advertising inquiries, promotional proposals,
            partnerships, and other business-related collaborations.
          </p>

          <ul className="mb-8 space-y-3 leading-7 text-slate-300">
            <li>• Promote your products and services.</li>
            <li>• Explore advertising opportunities.</li>
            <li>• Build brand awareness and online visibility.</li>
            <li>• Discuss business partnerships and collaborations.</li>
            <li>• Submit marketing and promotional proposals.</li>
            <li>• Contact us for other business-related opportunities.</li>
          </ul>

          <Link
            href="/advertise"
            className="inline-block rounded-xl bg-[#d6b45b] px-7 py-3 font-bold text-[#07110b] transition hover:bg-[#edcf79]"
          >
            Advertise With ALIQO
          </Link>
        </section>

        <section className="mb-16">
          <h2 className="mb-5 text-3xl font-bold text-[#d6b45b]">
            Our Mission
          </h2>

          <p className="leading-8 text-slate-300">
            Our mission is to make information discovery easier,
            more accessible, and more convenient while creating
            opportunities for businesses through digital promotion
            and collaboration.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="mb-5 text-3xl font-bold text-[#d6b45b]">
            Our Vision
          </h2>

          <p className="leading-8 text-slate-300">
            Our vision is to build a modern destination where
            people can search, explore, learn, and discover
            opportunities. We aim to continuously improve ALIQO
            through technology and a user-focused experience.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="mb-5 text-3xl font-bold text-[#d6b45b]">
            Contact Us
          </h2>

          <p className="mb-4 leading-8 text-slate-300">
            Have a question, suggestion, advertising inquiry,
            or business proposal? We would be happy to hear from you.
          </p>

          <a
            href="mailto:aliqo37311011@gmail.com"
            className="font-semibold text-[#d6b45b] hover:text-[#edcf79]"
          >
            aliqo37311011@gmail.com
          </a>
        </section>

        <section className="rounded-2xl border border-[#d6b45b]/30 bg-[#0c1711] px-6 py-12 text-center">
          <h2 className="text-3xl font-extrabold">
            ALIQO — Search Beyond Limits.
          </h2>

          <p className="mt-4 text-lg text-[#d6b45b]">
            Explore More. Discover Better. Grow Together.
          </p>

          <Link
            href="/"
            className="mt-8 inline-block rounded-xl border border-[#d6b45b] px-8 py-3 font-semibold text-[#d6b45b] transition hover:bg-[#d6b45b] hover:text-[#07110b]"
          >
            Back to Home
          </Link>
        </section>
      </article>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} ALIQO. All rights reserved.
      </footer>
    </main>
  );
}
