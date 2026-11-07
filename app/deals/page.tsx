
import Link from "next/link";

const categories = [
  {
    title: "Technology",
    description: "Discover gadgets, electronics and smart devices.",
    icon: "💻",
    color: "from-blue-500/20 to-cyan-500/10",
  },
  {
    title: "Shopping",
    description: "Explore fashion, accessories and shopping offers.",
    icon: "🛍️",
    color: "from-purple-500/20 to-pink-500/10",
  },
  {
    title: "Education",
    description: "Find courses, learning tools and study resources.",
    icon: "📚",
    color: "from-emerald-500/20 to-teal-500/10",
  },
  {
    title: "Lifestyle",
    description: "Discover useful products and everyday services.",
    icon: "✨",
    color: "from-orange-500/20 to-yellow-500/10",
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
        <p className="mb-4 text-sm font-bold tracking-[0.3em] text-blue-400">
          ALIQO DISCOVERY
        </p>
        <h1 className="text-4xl font-extrabold sm:text-6xl">
          Discover More.
          <span className="block text-blue-400">Save More.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Explore products, discover useful services and find exciting
          opportunities — all in one place.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Explore Categories</h2>
          <p className="mt-2 text-slate-400">
            Find what you are looking for.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.title}
              className={`rounded-2xl border border-white/10 bg-gradient-to-br ${category.color} p-7 transition hover:-translate-y-1 hover:border-blue-400/50`}
            >
              <div className="mb-5 text-4xl">{category.icon}</div>
              <h3 className="text-xl font-bold">{category.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {category.description}
              </p>
              <span className="mt-6 inline-block text-sm font-semibold text-blue-300">
                Coming Soon →
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Featured Deals</h2>
          <p className="mt-2 text-slate-400">
            Carefully selected offers will appear here.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "🎧",
              title: "Technology & Gadgets",
              description: "Discover headphones, smart devices and accessories.",
            },
            {
              icon: "👟",
              title: "Fashion & Accessories",
              description: "Explore clothing, footwear and everyday essentials.",
            },
            {
              icon: "🎓",
              title: "Learning & Courses",
              description: "Find useful online courses and learning resources.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-slate-900 p-7"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-4xl">
                {item.icon}
              </div>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                Coming Soon
              </span>
              <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20 text-center">
        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-10">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Great Discoveries Start Here.
          </h2>
          <p className="mt-4 leading-7 text-slate-300">
            ALIQO Deals is growing. Real products, partner offers and
            shopping opportunities will be added soon.
          </p>
          <Link
            href="/"
            className="mt-7 inline-block rounded-full bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-500"
          >
            Explore ALIQO Search
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        © 2026 ALIQO. All rights reserved.
      </footer>
    </main>
  );
}
