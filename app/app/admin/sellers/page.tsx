
"use client";

import { useEffect, useState } from "react";

type Seller = {
  user_id: string;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  category: string;
  city: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");

  async function loadSellers() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/sellers", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load sellers");
      }

      setSellers(data.sellers || []);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSellers();
  }, []);

  async function updateStatus(
    userId: string,
    status: "approved" | "rejected"
  ) {
    const action = status === "approved" ? "approve" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this seller?`)) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch("/api/admin/sellers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update seller");
      }

      setMessage(data.message || "Seller status updated successfully.");
      await loadSellers();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Update failed"
      );
    }
  }

  const pending = sellers.filter((s) => s.status === "pending").length;
  const approved = sellers.filter((s) => s.status === "approved").length;
  const rejected = sellers.filter((s) => s.status === "rejected").length;

  const visibleSellers =
    filter === "all"
      ? sellers
      : sellers.filter((s) => s.status === filter);

  const statusStyle = {
    pending: "border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#E8C75A]",
    approved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    rejected: "border-red-500/30 bg-red-500/10 text-red-400",
  };

  const stats = [
    {
      label: "Total Sellers",
      value: sellers.length,
      color: "text-white",
    },
    {
      label: "Pending",
      value: pending,
      color: "text-[#D4AF37]",
    },
    {
      label: "Approved",
      value: approved,
      color: "text-emerald-400",
    },
    {
      label: "Rejected",
      value: rejected,
      color: "text-red-400",
    },
  ];

  return (
    <main className="min-h-screen bg-[#080D0A] px-4 py-8 text-[#F5F5F0] sm:px-6">
      <div className="mx-auto max-w-6xl">

        <a
          href="/admin"
          className="text-3xl font-extrabold tracking-wide text-[#D4AF37]"
        >
          ALIQO<span className="text-white">.</span>
        </a>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              Admin Control Center
            </p>

            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Seller Applications
            </h1>

            <p className="mt-2 text-sm text-[#A9B6AC]">
              Manage and review seller registration requests.
            </p>
          </div>

          <button
            onClick={loadSellers}
            disabled={loading}
            className="rounded-lg border border-[#D4AF37]/50 bg-[#123D2B] px-5 py-2.5 font-semibold text-[#E8C75A] transition hover:bg-[#1A5139] disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-[#D4AF37]/30 bg-[#14251B] p-4 text-sm text-[#E8C75A]">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#D4AF37]/25 bg-[#101813] p-5 shadow-lg shadow-black/20 transition hover:border-[#D4AF37]/60"
            >
              <p className="text-sm font-medium text-[#A9B6AC]">
                {item.label}
              </p>

              <p className={`mt-3 text-4xl font-extrabold ${item.color}`}>
                {item.value}
              </p>

              <div className="mt-4 h-1 w-12 rounded-full bg-[#D4AF37]" />
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-[#D4AF37]/20 bg-[#101813] p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            Filter Applications
          </p>

          <div className="flex flex-wrap gap-2">
            {["all", "pending", "approved", "rejected"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-lg border px-5 py-2 text-sm font-semibold capitalize transition ${
                  filter === item
                    ? "border-[#D4AF37] bg-[#D4AF37] text-[#080D0A]"
                    : "border-[#D4AF37]/20 bg-[#080D0A] text-[#D5DED6] hover:border-[#D4AF37] hover:text-[#E8C75A]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#101813] p-12 text-center">
              <p className="font-medium text-[#D4AF37]">
                Loading seller applications...
              </p>
            </div>
          ) : visibleSellers.length === 0 ? (
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#101813] p-12 text-center">
              <div className="mb-4 text-4xl text-[#D4AF37]">◇</div>
              <h2 className="text-xl font-bold text-white">
                No Seller Applications Found
              </h2>
              <p className="mt-2 text-sm text-[#A9B6AC]">
                Applications will appear here when they are successfully loaded.
              </p>
            </div>
          ) : (
            visibleSellers.map((seller) => (
              <div
                key={seller.user_id}
                className="rounded-2xl border border-[#D4AF37]/25 bg-[#101813] p-5 shadow-lg shadow-black/20 transition hover:border-[#D4AF37]/60 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {seller.business_name}
                    </h2>

                    <p className="mt-2 text-sm text-[#A9B6AC]">
                      Owner: {seller.owner_name}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-4 py-1.5 text-xs font-bold capitalize ${
                      statusStyle[seller.status]
                    }`}
                  >
                    {seller.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 border-t border-[#D4AF37]/15 pt-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <p>
                    <span className="text-[#A9B6AC]">Email</span>
                    <br />
                    <span className="mt-1 inline-block break-all text-white">
                      {seller.email}
                    </span>
                  </p>

                  <p>
                    <span className="text-[#A9B6AC]">Phone</span>
                    <br />
                    <span className="mt-1 inline-block text-white">
                      {seller.phone}
                    </span>
                  </p>

                  <p>
                    <span className="text-[#A9B6AC]">Category</span>
                    <br />
                    <span className="mt-1 inline-block text-white">
                      {seller.category}
                    </span>
                  </p>

                  <p>
                    <span className="text-[#A9B6AC]">City</span>
                    <br />
                    <span className="mt-1 inline-block text-white">
                      {seller.city}
                    </span>
                  </p>

                  <p>
                    <span className="text-[#A9B6AC]">Applied</span>
                    <br />
                    <span className="mt-1 inline-block text-white">
                      {new Date(seller.created_at).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                {seller.status === "pending" && (
                  <div className="mt-6 flex flex-wrap gap-3 border-t border-[#D4AF37]/15 pt-5">
                    <button
                      onClick={() =>
                        updateStatus(seller.user_id, "approved")
                      }
                      className="rounded-lg border border-[#D4AF37] bg-[#D4AF37] px-5 py-2.5 font-bold text-[#080D0A] transition hover:bg-[#E8C75A]"
                    >
                      ✓ Approve Seller
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(seller.user_id, "rejected")
                      }
                      className="rounded-lg border border-red-500/40 bg-red-950/40 px-5 py-2.5 font-bold text-red-300 transition hover:bg-red-900/60"
                    >
                      ✕ Reject Seller
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-10 border-t border-[#D4AF37]/20 pt-6">
          <a
            href="/admin"
            className="font-semibold text-[#D4AF37] transition hover:text-[#F0D477]"
          >
            ← Back to Admin Dashboard
          </a>

          <p className="mt-6 text-center text-xs text-[#718075]">
            ALIQO — Discover More. Do More.
          </p>
        </div>
      </div>
    </main>
  );
}
