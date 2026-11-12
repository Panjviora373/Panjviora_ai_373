export const instant = false;
type Product = {
  id: string;
  product_name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  stock_quantity: number;
};

async function getProduct(id: string): Promise<Product | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return null;

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/marketplace_products?select=id,product_name,description,price,category,image_url,stock_quantity&id=eq.${encodeURIComponent(id)}&limit=1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) return null;

    const products: Product[] = await response.json();
    return products[0] ?? null;
  } catch {
    return null;
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <main className="min-h-screen bg-[#050907] text-white">
      <header className="border-b border-[#c9a44c]/30 bg-[#08130e] px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="/" className="text-3xl font-black text-[#d6b45c]">
            ALIQO
          </a>
          <a
            href="/marketplace"
            className="rounded-full border border-[#d6b45c]/60 px-5 py-2 text-sm text-[#e6ca7a]"
          >
            Back to Marketplace
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {!product ? (
          <div className="py-20 text-center">
            <h1 className="text-3xl font-bold text-[#d6b45c]">
              Product Not Found
            </h1>
            <p className="mt-4 text-gray-400">
              This product may not be available.
            </p>
            <a
              href="/marketplace"
              className="mt-6 inline-block text-[#e6ca7a] underline"
            >
              Return to Marketplace
            </a>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2">
            <div className="flex min-h-[350px] items-center justify-center overflow-hidden rounded-3xl border border-[#c9a44c]/25 bg-[#0b1711]">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="h-full max-h-[550px] w-full object-contain"
                />
              ) : (
                <span className="text-5xl font-black text-[#d6b45c]">
                  ALIQO
                </span>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#d6b45c]">
                {product.category}
              </p>

              <h1 className="mt-4 text-3xl font-black md:text-5xl">
                {product.product_name}
              </h1>

              <p className="mt-6 leading-7 text-gray-400">
                {product.description || "Explore this product on ALIQO."}
              </p>

              <p className="mt-8 text-3xl font-bold text-[#e4c46d]">
                {formatPrice(Number(product.price))}
              </p>

              <p className="mt-3 text-sm text-gray-400">
                {product.stock_quantity > 0
                  ? `${product.stock_quantity} in stock`
                  : "Out of stock"}
              </p>

              <button
                type="button"
                disabled
                className="mt-8 cursor-not-allowed rounded-xl bg-[#d6b45c] px-8 py-4 font-bold text-black opacity-70"
              >
                Buy Now — Coming Soon
              </button>

              <p className="mt-3 text-xs text-gray-500">
                Secure checkout and ordering will be available soon.
              </p>
            </div>
          </div>
        )}
      </section>

      <footer className="border-t border-[#c9a44c]/20 bg-[#08130e] px-6 py-8 text-center text-sm text-gray-500">
        © 2026 ALIQO. All rights reserved.
      </footer>
    </main>
  );
}
