
import Link from "next/link";

export const dynamic = "force-dynamic";

type Deal = {
  id: number;
  business_name: string;
  title: string;
  description: string;
  category: string | null;
  offer_url: string | null;
  valid_until: string | null;
  created_at: string;
};

async function getApprovedDeals(): Promise<Deal[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    console.error("Supabase public configuration is missing.");
    return [];
  }

  const today = new Date().toISOString().slice(0, 10);

  const url = new URL(
    "/rest/v1/deals",
    supabaseUrl.replace(/\/+$/, "") + "/"
  );

  url.searchParams.set(
    "select",
    "id,business_name,title,description,category,offer_url,valid_until,created_at"
  );
  url.searchParams.set("status", "eq.approved");
  url.searchParams.set(
    "or",
    `(valid_until.is.null,valid_until.gte.${today})`
  );
  url.searchParams.set("order", "created_at.desc");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Deals request failed:", response.status);
      return [];
    }

    const data: Deal[] = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load deals:", error);
    return [];
  }
}

const categories = [
  {
    title: "Technology",
    description: "Gadgets, electronics and smart devices.",
    icon: "💻",
  },
  {
    title: "Shopping",
    description: "Fashion, accessories and shopping offers.",
    icon: "🛍️",
  },
  {
    title: "Education",
    description: "Courses, learning tools and study resources.",
    icon: "📚",
  },
  {
    title: "Lifestyle",
    description: "Useful products and everyday services.",
    icon: "✨",
  },
];

export default async function DealsPage() {
  const deals = await getApprovedDeals();

  return (
    <main className="min-h-screen bg-[#F3F6F1] text-[#18271D]">
      <nav className="sticky top-0 z-30 border-b border-[#D7E0D5] bg-[#10271D]/95 px-5 py-5 text-white shadow-lg backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight">
            ALI<span className="text-[#E4C35D]">QO</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/advertisements"
              className="hidden rounded-full border border-[#B9953B]/50 px-4 py-2 text-xs font-bold text-[#F0D77F] hover:bg-white/10 sm:block"
            >
              Advertisements
            </Link>

            <Link
              href="/"
              className="rounded-full bg-[#D4AF37] px-5 py-2 text-xs font-bold text-[#10271D] transition hover:bg-[#E4C35D]"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-5 py-24 text-center sm:py-32">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#D4AF37]/20 via-[#B5C9A9]/30 to-[#173B2B]/15 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl">
          <span className="inline-block rounded-full border border-[#D4AF37]/40 bg-white px-5 py-2 text-xs font-bold tracking-[0.25em] text-[#85631B]">
            ALIQO DISCOVERY
          </span>

          <h1 className="mt-8 text-5xl font-black tracking-tight text-[#10271D] sm:text-7xl">
            Discover More.
            <span className="mt-2 block text-[#B9953B]">
              Save More.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#647468] sm:text-lg">
            Explore products, discover useful services and find exciting
            shopping opportunities — all in one place.
          </p>

          <Link
            href="/advertisements"
            className="mt-9 inline-block rounded-full bg-[#173B2B] px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#24543C]"
          >
            Explore Businesses →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-10">
          <span className="text-xs font-bold tracking-[0.2em] text-[#A17C26]">
            EXPLORE
          </span>

          <h2 className="mt-3 text-3xl font-black text-[#10271D] sm:text-4xl">
            Explore Categories
          </h2>

          <p className="mt-3 text-[#647468]">
            Discover opportunities across different categories.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.title}
              className="rounded-3xl border border-[#D9E2D8] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#C49A32] hover:shadow-xl"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F0D9] text-3xl">
                {category.icon}
              </div>

              <h3 className="text-xl font-extrabold text-[#173B2B]">
                {category.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#647468]">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#D9E2D8] bg-white px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <span className="text-xs font-bold tracking-[0.2em] text-[#A17C26]">
              SPECIAL DISCOVERY
            </span>

            <h2 className="mt-3 text-3xl font-black text-[#10271D] sm:text-4xl">
              Featured Deals
            </h2>

            <p className="mt-3 text-[#647468]">
              Discover approved offers and shopping opportunities.
            </p>
          </div>

          {deals.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {deals.map((deal) => (
                <article
                  key={deal.id}
                  className="rounded-3xl border border-[#D9E2D8] bg-[#F8FAF6] p-7 transition hover:-translate-y-1 hover:border-[#C49A32] hover:shadow-lg"
                >
                  <span className="rounded-full bg-[#F7F0D9] px-3 py-1 text-xs font-bold text-[#85631B]">
                    {deal.category || "Special Offer"}
                  </span>

                  <h3 className="mt-5 text-xl font-extrabold text-[#173B2B]">
                    {deal.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#647468]">
                    {deal.description}
                  </p>

                  <p className="mt-5 text-sm font-bold text-[#173B2B]">
                    {deal.business_name}
                  </p>

                  {deal.valid_until && (
                    <p className="mt-2 text-xs text-[#647468]">
                      Valid until: {deal.valid_until}
                    </p>
                  )}

                  {deal.offer_url && (
                    <a
                      href={deal.offer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-block rounded-full bg-[#173B2B] px-5 py-3 text-sm font-bold text-white hover:bg-[#24543C]"
                    >
                      View Offer →
                    </a>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#D9E2D8] bg-[#F8FAF6] p-10 text-center">
              <h3 className="text-xl font-bold text-[#173B2B]">
                No Active Deals Yet
              </h3>
              <p className="mt-3 text-sm text-[#647468]">
                New approved offers will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="rounded-[2rem] bg-[#10271D] p-9 text-center text-white shadow-xl sm:p-14">
          <span className="text-xs font-bold tracking-[0.25em] text-[#E4C35D]">
            GROW WITH ALIQO
          </span>

          <h2 className="mt-5 text-3xl font-black sm:text-4xl">
            Have an Offer to Share?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#C9D5CA]">
            Bring your business and special offers to the ALIQO discovery
            platform.
          </p>

          <Link
            href="/advertise"
            className="mt-8 inline-block rounded-full bg-[#D4AF37] px-8 py-4 font-bold text-[#10271D] transition hover:bg-[#E4C35D]"
          >
            Promote Your Business →
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#D9E2D8] bg-[#10271D] px-5 py-10 text-center text-sm text-[#C4D0C5]">
        <Link href="/" className="text-2xl font-black text-white">
          ALI<span className="text-[#E4C35D]">QO</span>
        </Link>

        <p className="mt-3">Explore more. Discover more.</p>

        <div className="mt-6 flex flex-wrap justify-center gap-6">
          <Link href="/" className="hover:text-[#E4C35D]">Home</Link>
          <Link href="/deals" className="hover:text-[#E4C35D]">Deals</Link>
          <Link href="/advertisements" className="hover:text-[#E4C35D]">Advertisements</Link>
          <Link href="/advertise" className="hover:text-[#E4C35D]">Advertise With Us</Link>
        </div>

        <p className="mt-8 text-xs text-[#829084]">
          © 2026 ALIQO. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
