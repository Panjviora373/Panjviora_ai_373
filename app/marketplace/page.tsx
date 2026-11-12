
"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  product_name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  stock_quantity: number;
};

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/marketplace/products", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Products could not be loaded");
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch {
        setError("Marketplace is temporarily unavailable. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <main className="min-h-screen bg-[#050907] text-white">
      <header className="border-b border-[#c9a44c]/30 bg-[#08130e]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-3xl font-black tracking-wider text-[#d6b45c]"
          >
            ALIQO
          </a>

          <a
            href="/"
            className="rounded-full border border-[#d6b45c]/60 px-5 py-2 text-sm text-[#e6ca7a] transition hover:bg-[#d6b45c] hover:text-black"
          >
            Back to Home
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#d6b45c]">
            Discover • Shop • Explore
          </p>

          <h1 className="text-4xl font-black md:text-6xl">
            ALIQO <span className="text-[#d6b45c]">Marketplace</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Explore products from ALIQO sellers, all in one place.
          </p>
        </div>

        {loading && (
          <p className="py-16 text-center text-[#d6b45c]">
            Loading products...
          </p>
        )}

        {error && (
          <p className="py-16 text-center text-red-400">{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-[#d6b45c]/20 bg-[#0b1711] px-6 py-16 text-center">
            <h2 className="text-2xl font-bold text-[#d6b45c]">
              Coming Soon
            </h2>

            <p className="mt-3 text-gray-400">
              Approved products will appear here soon.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-[#c9a44c]/25 bg-[#0b1711] transition duration-300 hover:-translate-y-1 hover:border-[#d6b45c] hover:shadow-xl hover:shadow-[#d6b45c]/10"
              >
                <div className="flex h-56 items-center justify-center bg-[#111d16]">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.product_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-black text-[#d6b45c]">
                      ALIQO
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#d6b45c]">
                    {product.category}
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    {product.product_name}
                  </h2>

                  <p className="mt-2 min-h-12 text-sm text-gray-400">
                    {product.description ||
                      "Explore this product on ALIQO."}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-lg font-bold text-[#e4c46d]">
                      {formatPrice(Number(product.price))}
                    </span>

                    <span className="text-xs text-gray-400">
                      {product.stock_quantity > 0
                        ? `${product.stock_quantity} in stock`
                        : "Out of stock"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-[#c9a44c]/20 bg-[#08130e] px-6 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ALIQO. All rights reserved.
      </footer>
    </main>
  );
}
