
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  seller_id: string;
  product_name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  stock_quantity: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/products", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });

      if (response.status === 401) {
        window.location.href = "/admin";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load products");
      }

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    const message =
      status === "approved"
        ? "Are you sure you want to approve this product?"
        : "Are you sure you want to reject this product?";

    if (!window.confirm(message)) return;

    setUpdating(id);
    setError("");

    try {
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Product update failed");
      }

      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdating(null);
    }
  }

  const counts = useMemo(
    () => ({
      all: products.length,
      pending: products.filter((p) => p.status === "pending").length,
      approved: products.filter((p) => p.status === "approved").length,
      rejected: products.filter((p) => p.status === "rejected").length,
    }),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesFilter = filter === "all" || product.status === filter;
      const term = search.toLowerCase();

      const matchesSearch =
        product.product_name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.seller_id.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [products, filter, search]);

  const money = (price: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 2,
    }).format(price);

  return (
    <main className="min-h-screen bg-[#050806] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/admin" className="text-[#D6AE45] text-sm hover:text-[#F2D47A] hover:underline">
              ← Back to Admin Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mt-3 text-[#F2D47A]">
              ALIQO Product Approval
            </h1>
            <p className="text-gray-400 mt-2">
              Review and manage products submitted by sellers.
            </p>
          </div>

          <button
            onClick={loadProducts}
            disabled={loading}
            className="rounded-xl bg-[#D6AE45] px-5 py-3 font-bold text-black hover:bg-[#F2D47A] disabled:opacity-50"
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "All Products", value: counts.all },
            { label: "Pending", value: counts.pending },
            { label: "Approved", value: counts.approved },
            { label: "Rejected", value: counts.rejected },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#A88936]/40 bg-[#102019] p-5 shadow-lg shadow-black/30"
            >
              <p className="text-sm text-gray-400">{item.label}</p>
              <p className="text-3xl font-bold text-[#D6AE45] mt-2">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-[#A88936]/40 bg-[#102019] p-4 md:p-6 shadow-xl shadow-black/40">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, category or seller ID..."
              className="w-full md:max-w-md rounded-xl border border-[#A88936]/40 bg-[#050806] px-4 py-3 text-white outline-none focus:border-[#D6AE45] placeholder:text-gray-500"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-[#A88936]/40 bg-[#050806] px-4 py-3 text-white outline-none focus:border-[#D6AE45]"
            >
              <option value="all">All Products</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-12">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-14">
              <p className="text-xl font-semibold text-[#D6AE45]">No products found</p>
              <p className="text-gray-400 mt-2">
                Seller submissions will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-[#A88936]/40 bg-[#050806] shadow-lg shadow-black/40"
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.product_name}
                      className="h-52 w-full object-cover bg-[#102019]"
                    />
                  ) : (
                    <div className="h-52 flex items-center justify-center bg-[#102019] text-[#D6AE45]">
                      No Product Image
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-[#D6AE45] uppercase tracking-wider">
                        {product.category}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.status === "approved"
                            ? "bg-green-500/15 text-green-400"
                            : product.status === "rejected"
                            ? "bg-red-500/15 text-red-400"
                            : "bg-[#D6AE45]/15 text-[#F2D47A]"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold mt-3 text-white">
                      {product.product_name}
                    </h2>

                    <p className="text-[#D6AE45] text-lg font-bold mt-2">
                      {money(Number(product.price))}
                    </p>

                    <p className="text-sm text-gray-400 mt-2">
                      Stock: {product.stock_quantity}
                    </p>

                    <p className="text-sm text-gray-400 mt-3 break-all">
                      Seller ID: {product.seller_id}
                    </p>

                    {product.description && (
                      <p className="text-sm text-gray-300 mt-3 line-clamp-3">
                        {product.description}
                      </p>
                    )}

                    <p className="text-xs text-gray-500 mt-4">
                      Submitted: {new Date(product.created_at).toLocaleString()}
                    </p>

                    {product.status === "pending" && (
                      <div className="grid grid-cols-2 gap-3 mt-5">
                        <button
                          onClick={() => updateStatus(product.id, "approved")}
                          disabled={updating === product.id}
                          className="rounded-xl bg-[#D6AE45] px-3 py-3 font-bold text-black hover:bg-[#F2D47A] disabled:opacity-50"
                        >
                          {updating === product.id ? "Please wait..." : "✓ Approve"}
                        </button>

                        <button
                          onClick={() => updateStatus(product.id, "rejected")}
                          disabled={updating === product.id}
                          className="rounded-xl border border-red-500/50 bg-red-500/10 px-3 py-3 font-semibold text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="text-center text-[#D6AE45]/70 text-sm mt-8">
          ALIQO Admin • Product Management
        </footer>
      </div>
    </main>
  );
}
