import Link from "next/link";

const categories = [
  {
    title: "Technology",
    description: "Explore useful technology and gadgets.",
    icon: "💻",
  },
  {
    title: "Shopping",
    description: "Discover products and shopping offers.",
    icon: "🛍️",
  },
  {
    title: "Education",
    description: "Find learning tools and online courses.",
    icon: "📚",
  },
  {
    title: "Lifestyle",
    description: "Explore useful services for everyday life.",
    icon: "✨",
  },
];

export default function DealsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <Link href="/" className="text-2xl font-extrabold text-blue-400">
          ALIQO
        </Link>
        <Link
          href="/"
          className="rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/10"
        >
          Back to Search
        </Link>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="mb-4 font-semibold tracking-[0.3em] text-blue-400">
          ALIQO DISCOVERY
        </p>

        <h1 className="text-4xl font-extrabold sm:text-6xl">
          Discover More.
          <span className="block text-blue-400">Save More.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Explore useful products, services, learning resources and
          opportunities — all in one place.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.title}
            className="rounded-2xl border border-white/10 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-blue-500/50"
          >
            <div className="mb-5 text-4xl">{category.icon}</div>
            <h2 className="mb-3 text-xl font-bold">{category.title}</h2>
            <p className="text-sm leading-6 text-slate-400">
              {category.description}
            </p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20 text-center">
        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-10">
          <h2 className="text-2xl font-bold">Exciting offers coming soon!</h2>
          <p className="mt-4 leading-7 text-slate-300">
            ALIQO Deals is being developed. Product recommendations,
            special offers and partner links will appear here as they
            become available.
          </p>
          <Link
            href="/"
            className="mt-7 inline-block rounded-full bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-500"
          >
            Explore ALIQO
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        © 2026 ALIQO. All rights reserved.
      </footer>
    </main>
  );
}
