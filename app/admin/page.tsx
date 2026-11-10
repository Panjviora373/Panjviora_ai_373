
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Request = {
  id?: number | string;
  business_name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  advertising_details?: string;
  created_at?: string;
  status?: string;
};

type StatusFilter = "All" | "Pending" | "Approved" | "Rejected";

function normalizeStatus(status?: string): StatusFilter {
  const value = (status || "pending").toLowerCase();

  if (value === "approved") return "Approved";
  if (value === "rejected") return "Rejected";
  return "Pending";
}

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [selected, setSelected] = useState<Request | null>(null);

  async function loadRequests() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/requests", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });

      if (!response.ok) {
        setAuthenticated(false);
        setRequests([]);

        if (response.status !== 401) {
          throw new Error("Could not load advertising requests.");
        }
        return;
      }

      const data = await response.json();

      setRequests(data);
      setAuthenticated(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load requests."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      setPassword("");
      await loadRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    item: Request,
    newStatus: "Approved" | "Rejected"
  ) {
    if (item.id == null) {
      setError("This request has no ID.");
      return;
    }

    setUpdatingId(item.id);
    setError("");

    try {
      const response = await fetch("/api/admin/requests", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          status: newStatus.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Status update failed.");
      }

      if (!data || data.length === 0) {
        throw new Error("No request was updated.");
      }

      setRequests((current) =>
        current.map((request) =>
          request.id === item.id
            ? { ...request, status: newStatus }
            : request
        )
      );

      if (selected?.id === item.id) {
        setSelected({ ...selected, status: newStatus });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteRequest(item: Request) {
    if (item.id == null) {
      setError("This request has no ID.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this request?")) {
      return;
    }

    setDeletingId(item.id);
    setError("");

    try {
      const response = await fetch("/api/admin/requests", {
        method: "DELETE",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Delete failed.");
      }

      if (!data || data.length === 0) {
        throw new Error("No request was deleted.");
      }

      setRequests((current) =>
        current.filter((request) => request.id !== item.id)
      );

      if (selected?.id === item.id) setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      setAuthenticated(false);
      setRequests([]);
      setEmail("");
      setPassword("");
      setSearch("");
      setFilter("All");
      setSelected(null);
      setError("");
    }
  }

  function getWhatsAppLink(phone?: string) {
    const digits = (phone || "").replace(/\D/g, "");
    if (!digits) return "#";

    const number = digits.startsWith("0")
      ? `92${digits.slice(1)}`
      : digits.startsWith("92")
        ? digits
        : `92${digits}`;

    return `https://wa.me/${number}`;
  }

  function statusStyle(status?: string) {
    const value = normalizeStatus(status);

    if (value === "Approved") {
      return "border border-green-500/30 bg-green-500/15 text-green-300";
    }

    if (value === "Rejected") {
      return "border border-red-500/30 bg-red-500/15 text-red-300";
    }

    return "border border-[#D4AF37]/30 bg-[#D4AF37]/15 text-[#D4AF37]";
  }

  const pendingCount = requests.filter(
    (item) => normalizeStatus(item.status) === "Pending"
  ).length;

  const approvedCount = requests.filter(
    (item) => normalizeStatus(item.status) === "Approved"
  ).length;

  const rejectedCount = requests.filter(
    (item) => normalizeStatus(item.status) === "Rejected"
  ).length;

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((item) => {
      const matchesSearch = [
        item.business_name,
        item.contact_name,
        item.email,
        item.phone,
        item.advertising_details,
      ].some((value) => (value || "").toLowerCase().includes(query));

      const matchesStatus =
        filter === "All" || normalizeStatus(item.status) === filter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, filter]);

  return (
    <main className="min-h-screen bg-[#080D0A] px-4 py-10 text-[#F5F5F0] sm:px-6">
      <div className="mx-auto max-w-6xl">

        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black tracking-tight">
            ALI<span className="text-[#D4AF37]">QO</span>{" "}
            <span className="text-[#D4AF37]">Admin</span>
          </h1>

          <p className="mt-3 text-gray-400">
            Professional Advertising Management Dashboard
          </p>

          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#D4AF37]" />
        </header>

        {!authenticated ? (
          <form
            onSubmit={handleLogin}
            className="mx-auto max-w-md space-y-5 rounded-2xl border border-[#D4AF37]/40 bg-[#101813] p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-[#D4AF37]">
              Admin Login
            </h2>

            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="w-full rounded-lg border border-[#D4AF37]/30 bg-[#080D0A] p-3 text-[#F5F5F0] outline-none placeholder:text-gray-500 focus:border-[#D4AF37]"
            />

            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-[#D4AF37]/30 bg-[#080D0A] p-3 text-[#F5F5F0] outline-none placeholder:text-gray-500 focus:border-[#D4AF37]"
            />

            {error && (
              <p className="break-words text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#D4AF37] p-3 font-bold text-[#080D0A] transition hover:bg-[#E5C65B] disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Secure Admin Login"}
            </button>
          </form>
        ) : (
          <section>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Total Requests",
                  count: requests.length,
                },
                {
                  label: "Pending",
                  count: pendingCount,
                },
                {
                  label: "Approved",
                  count: approvedCount,
                },
                {
                  label: "Rejected",
                  count: rejectedCount,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[#D4AF37]/30 bg-[#123D2B] p-5 shadow-lg"
                >
                  <p className="text-sm font-semibold text-gray-300">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-black text-[#D4AF37]">
                    {stat.count}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#D4AF37]">
                Advertising Requests
              </h2>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/deals"
                  className="rounded-lg bg-[#D4AF37] px-4 py-2 font-bold text-[#080D0A] transition hover:bg-[#E5C65B]"
                >
                  Manage Deals →
                </Link>

                <Link
                  href="/admin/sellers"
                  className="rounded-lg bg-[#123D2B] px-4 py-2 font-bold text-[#F5F5F0] transition hover:bg-[#1B563D]"
                >
                  Manage Sellers →
                </Link>

                <button
                  onClick={loadRequests}
                  disabled={loading}
                  className="rounded-lg border border-[#D4AF37]/50 bg-[#101813] px-4 py-2 font-semibold text-[#D4AF37] transition hover:bg-[#123D2B] disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>

                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37] px-4 py-2 font-semibold text-[#080D0A] transition hover:bg-[#E5C65B]"
                >
                  Logout
                </button>
              </div>
            </div>

            {error && (
              <p className="mb-5 break-words rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                ⚠ {error}
              </p>
            )}

            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search business, name, email or phone..."
                className="w-full rounded-lg border border-[#D4AF37]/30 bg-[#101813] p-3 text-[#F5F5F0] outline-none placeholder:text-gray-500 focus:border-[#D4AF37]"
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as StatusFilter)}
                className="w-full rounded-lg border border-[#D4AF37]/30 bg-[#101813] p-3 text-[#F5F5F0] outline-none focus:border-[#D4AF37]"
              >
                <option value="All">All Requests</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <p className="mb-4 text-sm text-gray-400">
              Showing {filteredRequests.length} of {requests.length} requests
            </p>

            {filteredRequests.length === 0 ? (
              <div className="rounded-xl border border-[#D4AF37]/30 bg-[#101813] p-8 text-center text-gray-400">
                No matching advertising requests found.
              </div>
            ) : (
              <div className="space-y-5">
                {filteredRequests.map((item, index) => {
                  const status = normalizeStatus(item.status);

                  return (
                    <article
                      key={item.id ?? index}
                      className="rounded-xl border border-[#D4AF37]/30 bg-[#101813] p-6 shadow-xl transition hover:border-[#D4AF37]/60"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-xl font-bold text-[#D4AF37]">
                          {item.business_name || "Business"}
                        </h3>

                        <span
                          className={`rounded-full px-4 py-2 text-sm font-bold ${statusStyle(status)}`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 text-[#F5F5F0] sm:grid-cols-2">
                        <p>
                          <span className="text-gray-400">Contact:</span>{" "}
                          {item.contact_name || "—"}
                        </p>

                        <p>
                          <span className="text-gray-400">Email:</span>{" "}
                          {item.email || "—"}
                        </p>

                        <p>
                          <span className="text-gray-400">Phone:</span>{" "}
                          {item.phone || "—"}
                        </p>
                      </div>

                      <div className="mt-4 rounded-lg border border-[#D4AF37]/20 bg-[#123D2B] p-4">
                        <p className="mb-2 font-bold text-[#D4AF37]">
                          Advertising Details
                        </p>

                        <p className="whitespace-pre-wrap text-gray-200">
                          {item.advertising_details || "—"}
                        </p>
                      </div>

                      {item.created_at && (
                        <p className="mt-4 text-xs text-gray-400">
                          Submitted:{" "}
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          onClick={() => setSelected(item)}
                          className="rounded-lg border border-[#D4AF37]/40 bg-[#123D2B] px-4 py-2 font-semibold text-[#F5F5F0] transition hover:bg-[#1B563D]"
                        >
                          View Details
                        </button>

                        <button
                          onClick={() => updateStatus(item, "Approved")}
                          disabled={
                            updatingId === item.id || status === "Approved"
                          }
                          className="rounded-lg bg-[#D4AF37] px-4 py-2 font-semibold text-[#080D0A] transition hover:bg-[#E5C65B] disabled:opacity-40"
                        >
                          {updatingId === item.id ? "Updating..." : "Approve"}
                        </button>

                        <button
                          onClick={() => updateStatus(item, "Rejected")}
                          disabled={
                            updatingId === item.id || status === "Rejected"
                          }
                          className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500 disabled:opacity-40"
                        >
                          Reject
                        </button>

                        <a
                          href={getWhatsAppLink(item.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-[#123D2B] px-4 py-2 font-semibold text-[#F5F5F0] transition hover:bg-[#1B563D]"
                        >
                          Contact on WhatsApp
                        </a>

                        <button
                          onClick={() => deleteRequest(item)}
                          disabled={deletingId === item.id}
                          className="rounded-lg border border-red-500/50 px-4 py-2 font-semibold text-red-400 transition hover:bg-red-500/10 disabled:opacity-40"
                        >
                          {deletingId === item.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {selected && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#D4AF37]/50 bg-[#101813] p-6 text-[#F5F5F0] shadow-2xl">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-[#D4AF37]">
                      Request Details
                    </h2>

                    <button
                      onClick={() => setSelected(null)}
                      className="rounded-lg bg-[#D4AF37] px-3 py-2 font-semibold text-[#080D0A] transition hover:bg-[#E5C65B]"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-4 text-sm">
                    <p>
                      <strong className="text-[#D4AF37]">Business:</strong>{" "}
                      {selected.business_name || "—"}
                    </p>

                    <p>
                      <strong className="text-[#D4AF37]">Contact:</strong>{" "}
                      {selected.contact_name || "—"}
                    </p>

                    <p>
                      <strong className="text-[#D4AF37]">Email:</strong>{" "}
                      {selected.email || "—"}
                    </p>

                    <p>
                      <strong className="text-[#D4AF37]">Phone:</strong>{" "}
                      {selected.phone || "—"}
                    </p>

                    <p>
                      <strong className="text-[#D4AF37]">Status:</strong>{" "}
                      {normalizeStatus(selected.status)}
                    </p>

                    <div>
                      <strong className="text-[#D4AF37]">
                        Advertising Details:
                      </strong>

                      <p className="mt-2 whitespace-pre-wrap text-gray-300">
                        {selected.advertising_details || "—"}
                      </p>
                    </div>

                    {selected.created_at && (
                      <p>
                        <strong className="text-[#D4AF37]">Submitted:</strong>{" "}
                        {new Date(selected.created_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

          </section>
        )}
      </div>
    </main>
  );
}
