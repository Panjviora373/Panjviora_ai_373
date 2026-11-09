
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

      setMessage(data.message);
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
    pending: "bg-amber-500/10 text-amber-400",
    approved: "bg-emerald-500/10 text-emerald-400",
    rejected: "bg-red-500/10 text-red-400",
  };

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <a href="/admin" className="text-3xl font-bold text-emerald-400">
          ALIQO
        </a>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Seller Applications</h1>
            <p className="mt-2 text-slate-400">
              Manage and review seller registration requests.
            </p>
          </div>

          <button
            onClick={loadSellers}
            className="rounded-lg border border-white/20 px-5 py-2 hover:bg-white/10"
          >
            Refresh
          </button>
        </div>

        {message && (
          <div className="mt-6 rounded-lg bg-emerald-500/10 p-4 text-emerald-300">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[
            { label: "Total Sellers", value: sellers.length },
            { label: "Pending", value: pending },
            { label: "Approved", value: approved },
            { label: "Rejected", value: rejected },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-slate-900 p-5"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {["all", "pending", "approved", "rejected"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${
                filter === item
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-slate-800 text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <p className="py-10 text-center text-slate-400">
              Loading seller applications...
            </p>
          ) : visibleSellers.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-slate-900 p-10 text-center text-slate-400">
              No seller applications found.
            </div>
          ) : (
            visibleSellers.map((seller) => (
              <div
                key={seller.user_id}
                className="rounded-xl border border-white/10 bg-slate-900 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      {seller.business_name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Owner: {seller.owner_name}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                      statusStyle[seller.status]
                    }`}
                  >
                    {seller.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <p>
                    <span className="text-slate-400">Email:</span>
                    <br />
                    {seller.email}
                  </p>

                  <p>
                    <span className="text-slate-400">Phone:</span>
                    <br />
                    {seller.phone}
                  </p>

                  <p>
                    <span className="text-slate-400">Category:</span>
                    <br />
                    {seller.category}
                  </p>

                  <p>
                    <span className="text-slate-400">City:</span>
                    <br />
                    {seller.city}
                  </p>

                  <p>
                    <span className="text-slate-400">Applied:</span>
                    <br />
                    {new Date(seller.created_at).toLocaleDateString()}
                  </p>
                </div>

                {seller.status === "pending" && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        updateStatus(seller.user_id, "approved")
                      }
                      className="rounded-lg bg-emerald-500 px-5 py-2 font-bold text-slate-950 hover:bg-emerald-400"
                    >
                      Approve Seller
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(seller.user_id, "rejected")
                      }
                      className="rounded-lg bg-red-600 px-5 py-2 font-bold text-white hover:bg-red-500"
                    >
                      Reject Seller
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-8">
          <a
            href="/admin"
            className="text-emerald-400 hover:underline"
          >
            ← Back to Admin Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
