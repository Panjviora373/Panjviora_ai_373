
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Deal = {
  id: number;
  business_name: string;
  contact_name: string;
  email: string;
  title: string;
  description: string;
  category: string;
  offer_url: string | null;
  valid_until: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  async function loadDeals() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/deals", {
        cache: "no-store",
        credentials: "same-origin",
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        setError("Please log in through the main Admin Dashboard first.");
        setDeals([]);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to load deals.");
      }

      setDeals(data.deals || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDeals();
  }, []);

  async function updateStatus(
    id: number,
    status: "approved" | "rejected" | "pending"
  ) {
    setUpdatingId(id);
    setError("");

    try {
      const response = await fetch("/api/admin/deals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update deal.");
      }

      await loadDeals();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Update failed."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteDeal(id: number) {
    if (!window.confirm("Are you sure you want to delete this deal?")) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      const response = await fetch("/api/admin/deals", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete deal.");
      }

      setDeals((current) => current.filter((deal) => deal.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Delete failed."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const pending = deals.filter((deal) => deal.status === "pending").length;
  const approved = deals.filter((deal) => deal.status === "approved").length;
  const rejected = deals.filter((deal) => deal.status === "rejected").length;

  const filteredDeals =
    filter === "all"
      ? deals
      : deals.filter((deal) => deal.status === filter);

  function statusStyle(status: Deal["status"]) {
    if (status === "approved") {
      return "bg-green-100 text-green-800";
    }
    if (status === "rejected") {
      return "bg-red-100 text-red-800";
    }
    return "bg-amber-100 text-amber-800";
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-bold tracking-widest text-amber-400">
              ALIQO ADMIN
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              Deals Management
            </h1>
            <p className="mt-2 text-slate-400">
              Review and manage submitted business offers.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-lg border border-white/20 px-4 py-2 font-semibold hover:bg-white/10"
            >
              ← Main Dashboard
            </Link>

            <button
              onClick={loadDeals}
              className="rounded-lg bg-amber-500 px-4 py-2 font-bold text-slate-950 hover:bg-amber-400"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Total Deals</p>
            <p className="mt-2 text-3xl font-bold">{deals.length}</p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
            <p className="text-sm text-amber-300">Pending</p>
            <p className="mt-2 text-3xl font-bold">{pending}</p>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
            <p className="text-sm text-green-300">Approved</p>
            <p className="mt-2 text-3xl font-bold">{approved}</p>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
            <p className="text-sm text-red-300">Rejected</p>
            <p className="mt-2 text-3xl font-bold">{rejected}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
            <p className="mt-2">
              <Link href="/admin" className="font-bold underline">
                Go to Admin Login
              </Link>
            </p>
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-amber-400">
            Submitted Deals
          </h2>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-white/20 bg-slate-900 px-4 py-2 text-white"
          >
            <option value="all">All Deals</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-300">
            Loading deals...
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-lg font-semibold">No deals found.</p>
            <p className="mt-2 text-sm text-slate-400">
              Submitted offers will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredDeals.map((deal) => (
              <article
                key={deal.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-amber-400">
                      {deal.business_name} · {deal.category}
                    </p>
                    <h3 className="mt-2 text-xl font-bold">
                      {deal.title}
                    </h3>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusStyle(
                      deal.status
                    )}`}
                  >
                    {deal.status}
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-300">
                  {deal.description}
                </p>

                <div className="mt-5 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                  <p>
                    <strong className="text-white">Contact:</strong>{" "}
                    {deal.contact_name}
                  </p>
                  <p>
                    <strong className="text-white">Email:</strong>{" "}
                    {deal.email}
                  </p>
                  <p>
                    <strong className="text-white">Valid Until:</strong>{" "}
                    {deal.valid_until || "Not specified"}
                  </p>
                  <p>
                    <strong className="text-white">Submitted:</strong>{" "}
                    {new Date(deal.created_at).toLocaleString()}
                  </p>
                </div>

                {deal.offer_url && (
                  <p className="mt-3 break-all text-sm">
                    <a
                      href={deal.offer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 underline"
                    >
                      Visit Offer Website
                    </a>
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
                  <button
                    disabled={updatingId === deal.id}
                    onClick={() => updateStatus(deal.id, "approved")}
                    className="rounded-lg bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-500 disabled:opacity-50"
                  >
                    {updatingId === deal.id ? "Updating..." : "Approve"}
                  </button>

                  <button
                    disabled={updatingId === deal.id}
                    onClick={() => updateStatus(deal.id, "rejected")}
                    className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-500 disabled:opacity-50"
                  >
                    Reject
                  </button>

                  <button
                    disabled={deletingId === deal.id}
                    onClick={() => deleteDeal(deal.id)}
                    className="rounded-lg border border-red-500/50 px-4 py-2 font-bold text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {deletingId === deal.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
