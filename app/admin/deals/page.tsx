
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

      setDeals(Array.isArray(data) ? data : data.deals || []);
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
      return "border border-green-500/40 bg-green-500/15 text-green-300";
    }

    if (status === "rejected") {
      return "border border-red-500/40 bg-red-500/15 text-red-300";
    }

    return "border border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#D4AF37]";
  }

  return (
    <main className="min-h-screen bg-[#080D0A] px-4 py-8 text-[#F5F5F0] sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-bold tracking-[0.25em] text-[#D4AF37]">
              ALIQO ADMIN
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#F5F5F0]">
              Deals Management
            </h1>

            <p className="mt-2 text-[#B8C2BA]">
              Review and manage submitted business offers.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-lg border border-[#D4AF37]/50 px-4 py-2 font-semibold text-[#D4AF37] transition hover:bg-[#123D2B]"
            >
              ← Main Dashboard
            </Link>

            <button
              onClick={loadDeals}
              className="rounded-lg bg-[#D4AF37] px-5 py-2 font-bold text-[#080D0A] transition hover:bg-[#E6C65A]"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#123D2B] p-5">
            <p className="text-sm text-[#E5DDBD]">Total Deals</p>
            <p className="mt-2 text-3xl font-bold text-[#D4AF37]">
              {deals.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#101813] p-5">
            <p className="text-sm text-[#D4AF37]">Pending</p>
            <p className="mt-2 text-3xl font-bold text-[#D4AF37]">
              {pending}
            </p>
          </div>

          <div className="rounded-2xl border border-green-500/30 bg-[#101813] p-5">
            <p className="text-sm text-green-300">Approved</p>
            <p className="mt-2 text-3xl font-bold text-green-300">
              {approved}
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/30 bg-[#101813] p-5">
            <p className="text-sm text-red-300">Rejected</p>
            <p className="mt-2 text-3xl font-bold text-red-300">
              {rejected}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300">
            {error}

            <p className="mt-2">
              <Link
                href="/admin"
                className="font-bold text-[#D4AF37] underline"
              >
                Go to Admin Login
              </Link>
            </p>
          </div>
        )}

        {/* Deals Filter */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-[#D4AF37]">
            Submitted Deals
          </h2>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-[#D4AF37]/50 bg-[#101813] px-4 py-2 text-[#F5F5F0] outline-none focus:border-[#D4AF37]"
          >
            <option value="all">All Deals</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Deals List */}
        {loading ? (
          <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#101813] p-10 text-center text-[#D4AF37]">
            Loading deals...
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#101813] p-10 text-center">
            <p className="text-lg font-semibold text-[#F5F5F0]">
              No deals found.
            </p>

            <p className="mt-2 text-sm text-[#B8C2BA]">
              Submitted offers will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredDeals.map((deal) => (
              <article
                key={deal.id}
                className="rounded-2xl border border-[#D4AF37]/25 bg-[#101813] p-5 shadow-lg shadow-black/20 transition hover:border-[#D4AF37]/60 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#D4AF37]">
                      {deal.business_name} · {deal.category}
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-[#F5F5F0]">
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

                <p className="mt-4 whitespace-pre-wrap leading-7 text-[#D0D8D1]">
                  {deal.description}
                </p>

                <div className="mt-5 grid gap-3 rounded-xl border border-[#D4AF37]/15 bg-[#123D2B]/50 p-4 text-sm text-[#D0D8D1] sm:grid-cols-2">
                  <p>
                    <strong className="text-[#D4AF37]">Contact:</strong>{" "}
                    {deal.contact_name}
                  </p>

                  <p>
                    <strong className="text-[#D4AF37]">Email:</strong>{" "}
                    {deal.email}
                  </p>

                  <p>
                    <strong className="text-[#D4AF37]">Valid Until:</strong>{" "}
                    {deal.valid_until || "Not specified"}
                  </p>

                  <p>
                    <strong className="text-[#D4AF37]">Submitted:</strong>{" "}
                    {new Date(deal.created_at).toLocaleString()}
                  </p>
                </div>

                {deal.offer_url && (
                  <p className="mt-4 break-all text-sm">
                    <a
                      href={deal.offer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#D4AF37] underline hover:text-[#E6C65A]"
                    >
                      Visit Offer Website
                    </a>
                  </p>
                )}

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3 border-t border-[#D4AF37]/20 pt-5">
                  <button
                    disabled={updatingId === deal.id}
                    onClick={() => updateStatus(deal.id, "approved")}
                    className="rounded-lg bg-[#D4AF37] px-5 py-2 font-bold text-[#080D0A] transition hover:bg-[#E6C65A] disabled:opacity-50"
                  >
                    {updatingId === deal.id ? "Updating..." : "Approve"}
                  </button>

                  <button
                    disabled={updatingId === deal.id}
                    onClick={() => updateStatus(deal.id, "rejected")}
                    className="rounded-lg border border-red-500/50 bg-red-500/10 px-5 py-2 font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                  >
                    Reject
                  </button>

                  <button
                    disabled={deletingId === deal.id}
                    onClick={() => deleteDeal(deal.id)}
                    className="rounded-lg border border-red-500/50 px-5 py-2 font-bold text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
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
