
"use client";

import { useEffect, useMemo, useState } from "react";

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function normalizeStatus(status?: string) {
  const value = (status || "Pending").toLowerCase();

  if (value === "approved") return "Approved";
  if (value === "rejected") return "Rejected";

  return "Pending";
}

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [selected, setSelected] = useState<Request | null>(null);

  async function loadRequests(accessToken: string) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      setError("Supabase environment variables are missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/advertising_requests?select=*&order=created_at.desc`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error(await response.text());

      setRequests(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedToken = sessionStorage.getItem("aliqo_admin_token");

    if (savedToken) {
      setToken(savedToken);
      loadRequests(savedToken);
    }
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      setError("Supabase environment variables are missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      sessionStorage.setItem("aliqo_admin_token", data.access_token);
      setToken(data.access_token);
      setPassword("");
      await loadRequests(data.access_token);
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

    if (!SUPABASE_URL || !SUPABASE_KEY || !token) return;

    setUpdatingId(item.id);
    setError("");

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/advertising_requests?id=eq.${encodeURIComponent(String(item.id))}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error(await response.text());

      const rows = await response.json();

      if (!rows || rows.length === 0) {
        throw new Error("No request was updated. Check admin permissions.");
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

    if (!SUPABASE_URL || !SUPABASE_KEY || !token) return;

    setDeletingId(item.id);
    setError("");

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/advertising_requests?id=eq.${encodeURIComponent(String(item.id))}`,
        {
          method: "DELETE",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
            Prefer: "return=representation",
          },
        }
      );

      if (!response.ok) throw new Error(await response.text());

      const deletedRows = await response.json();

      if (!deletedRows || deletedRows.length === 0) {
        throw new Error("No request was deleted. Check admin permissions.");
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

  function handleLogout() {
    sessionStorage.removeItem("aliqo_admin_token");
    setToken("");
    setRequests([]);
    setEmail("");
    setPassword("");
    setSearch("");
    setFilter("All");
    setSelected(null);
    setError("");
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

    if (value === "Approved") return "bg-green-900 text-green-300";
    if (value === "Rejected") return "bg-red-900 text-red-300";

    return "bg-yellow-900 text-yellow-300";
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
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold">
            ALIQO <span className="text-blue-400">Admin</span>
          </h1>
          <p className="mt-3 text-slate-400">
            Professional Advertising Management Dashboard
          </p>
        </header>

        {!token ? (
          <form
            onSubmit={handleLogin}
            className="mx-auto max-w-md space-y-5 rounded-2xl border border-slate-700 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold">Admin Login</h2>

            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            />

            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            />

            {error && <p className="break-words text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 p-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Secure Admin Login"}
            </button>
          </form>
        ) : (
          <section>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total Requests", count: requests.length, style: "border-slate-700 text-white" },
                { label: "Pending", count: pendingCount, style: "border-yellow-800 text-yellow-400" },
                { label: "Approved", count: approvedCount, style: "border-green-800 text-green-400" },
                { label: "Rejected", count: rejectedCount, style: "border-red-800 text-red-400" },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-xl border bg-slate-900 p-5 ${stat.style}`}>
                  <p className="text-sm">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.count}</p>
                </div>
              ))}
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Advertising Requests</h2>

              <div className="flex gap-3">
                <button
                  onClick={() => loadRequests(token)}
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-4 py-2 font-semibold disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-600 px-4 py-2 font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>

            {error && (
              <p className="mb-5 break-words rounded-lg bg-red-950 p-4 text-red-300">
                {error}
              </p>
            )}

            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search business, name, email or phone..."
                className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white"
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as StatusFilter)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white"
              >
                <option value="All">All Requests</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <p className="mb-4 text-sm text-slate-400">
              Showing {filteredRequests.length} of {requests.length} requests
            </p>

            {filteredRequests.length === 0 ? (
              <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
                No matching advertising requests found.
              </div>
            ) : (
              <div className="space-y-5">
                {filteredRequests.map((item, index) => {
                  const status = normalizeStatus(item.status);

                  return (
                    <article
                      key={item.id ?? index}
                      className="rounded-xl border border-slate-700 bg-slate-900 p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-xl font-bold text-blue-400">
                          {item.business_name || "Business"}
                        </h3>

                        <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusStyle(status)}`}>
                          {status}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <p><span className="text-slate-400">Contact:</span> {item.contact_name || "—"}</p>
                        <p><span className="text-slate-400">Email:</span> {item.email || "—"}</p>
                        <p><span className="text-slate-400">Phone:</span> {item.phone || "—"}</p>
                      </div>

                      <div className="mt-4 rounded-lg bg-slate-800 p-4">
                        <p className="mb-2 font-semibold text-slate-300">Advertising Details</p>
                        <p className="whitespace-pre-wrap text-slate-400">{item.advertising_details || "—"}</p>
                      </div>

                      {item.created_at && (
                        <p className="mt-4 text-xs text-slate-500">
                          Submitted: {new Date(item.created_at).toLocaleString()}
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          onClick={() => setSelected(item)}
                          className="rounded-lg bg-blue-700 px-4 py-2 font-semibold hover:bg-blue-800"
                        >
                          View Details
                        </button>

                        <button
                          onClick={() => updateStatus(item, "Approved")}
                          disabled={updatingId === item.id || status === "Approved"}
                          className="rounded-lg bg-green-600 px-4 py-2 font-semibold hover:bg-green-700 disabled:opacity-40"
                        >
                          {updatingId === item.id ? "Updating..." : "Approve"}
                        </button>

                        <button
                          onClick={() => updateStatus(item, "Rejected")}
                          disabled={updatingId === item.id || status === "Rejected"}
                          className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-700 disabled:opacity-40"
                        >
                          Reject
                        </button>

                        <a
                          href={getWhatsAppLink(item.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold hover:bg-emerald-800"
                        >
                          Contact on WhatsApp
                        </a>

                        <button
                          onClick={() => deleteRequest(item)}
                          disabled={deletingId === item.id}
                          className="rounded-lg border border-red-500 px-4 py-2 font-semibold text-red-400 hover:bg-red-950 disabled:opacity-40"
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
                <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold">Request Details</h2>
                    <button
                      onClick={() => setSelected(null)}
                      className="rounded-lg bg-slate-700 px-3 py-2"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-4 text-sm">
                    <p><strong>Business:</strong> {selected.business_name || "—"}</p>
                    <p><strong>Contact:</strong> {selected.contact_name || "—"}</p>
                    <p><strong>Email:</strong> {selected.email || "—"}</p>
                    <p><strong>Phone:</strong> {selected.phone || "—"}</p>
                    <p><strong>Status:</strong> {normalizeStatus(selected.status)}</p>
                    <div>
                      <strong>Advertising Details:</strong>
                      <p className="mt-2 whitespace-pre-wrap text-slate-300">
                        {selected.advertising_details || "—"}
                      </p>
                    </div>
                    {selected.created_at && (
                      <p><strong>Submitted:</strong> {new Date(selected.created_at).toLocaleString()}</p>
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
