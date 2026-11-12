
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type OrderItem = {
  id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
};

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
};

type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function statusStyle(status: string) {
  switch (status) {
    case "confirmed":
      return "border-green-500/30 bg-green-500/15 text-green-300";
    case "shipped":
      return "border-blue-500/30 bg-blue-500/15 text-blue-300";
    case "delivered":
      return "border-emerald-500/30 bg-emerald-500/15 text-emerald-300";
    case "cancelled":
      return "border-red-500/30 bg-red-500/15 text-red-300";
    default:
      return "border-[#D4AF37]/30 bg-[#D4AF37]/15 text-[#D4AF37]";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [draftStatuses, setDraftStatuses] = useState<
    Record<string, OrderStatus>
  >({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  async function loadOrders() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/orders", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });

      if (response.status === 401) {
        throw new Error(
          "Admin login required. Please login from the Admin Dashboard first."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load orders.");
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid orders response.");
      }

      setOrders(data);

      const drafts: Record<string, OrderStatus> = {};
      data.forEach((order: Order) => {
        drafts[order.id] = STATUSES.includes(order.status as OrderStatus)
          ? (order.status as OrderStatus)
          : "pending";
      });

      setDraftStatuses(drafts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load orders."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(order: Order) {
    const newStatus = draftStatuses[order.id];

    if (!newStatus || newStatus === order.status) return;

    setUpdatingId(order.id);
    setError("");

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: order.id,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order status update failed.");
      }

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No order was updated.");
      }

      setOrders((current) =>
        current.map((item) =>
          item.id === order.id
            ? { ...item, status: newStatus }
            : item
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Status update failed."
      );
      await loadOrders();
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch = [
        order.id,
        order.customer_name,
        order.customer_phone,
        order.delivery_address,
      ].some((value) => (value || "").toLowerCase().includes(query));

      const matchesStatus =
        filter === "all" || order.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, filter]);

  const pendingCount = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const confirmedCount = orders.filter(
    (order) => order.status === "confirmed"
  ).length;

  const deliveredCount = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  function getWhatsAppLink(phone: string) {
    const digits = (phone || "").replace(/\D/g, "");

    if (!digits) return "#";

    const number = digits.startsWith("0")
      ? `92${digits.slice(1)}`
      : digits.startsWith("92")
        ? digits
        : `92${digits}`;

    return `https://wa.me/${number}`;
  }

  return (
    <main className="min-h-screen bg-[#080D0A] px-4 py-10 text-[#F5F5F0] sm:px-6">
      <div className="mx-auto max-w-6xl">

        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black tracking-tight">
            ALI<span className="text-[#D4AF37]">QO</span>{" "}
            <span className="text-[#D4AF37]">Orders</span>
          </h1>

          <p className="mt-3 text-gray-400">
            Professional Order Management Dashboard
          </p>

          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#D4AF37]" />
        </header>

        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="rounded-lg border border-[#D4AF37]/40 bg-[#101813] px-4 py-2 font-semibold text-[#D4AF37] hover:bg-[#123D2B]"
          >
            ← Admin Dashboard
          </Link>

          <button
            onClick={loadOrders}
            disabled={loading}
            className="rounded-lg bg-[#D4AF37] px-4 py-2 font-bold text-[#080D0A] hover:bg-[#E5C65B] disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh Orders"}
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}

            {error.includes("Admin login required") && (
              <p className="mt-3">
                <Link
                  href="/admin"
                  className="font-bold text-[#D4AF37] underline"
                >
                  Go to Admin Login
                </Link>
              </p>
            )}
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Orders", count: orders.length },
            { label: "Pending", count: pendingCount },
            { label: "Confirmed", count: confirmedCount },
            { label: "Delivered", count: deliveredCount },
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

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, phone or order ID..."
            className="w-full rounded-lg border border-[#D4AF37]/30 bg-[#101813] p-3 text-white outline-none placeholder:text-gray-500 focus:border-[#D4AF37]"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full rounded-lg border border-[#D4AF37]/30 bg-[#101813] p-3 text-white outline-none focus:border-[#D4AF37]"
          >
            <option value="all">All Orders</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-4 text-sm text-gray-400">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>

        {loading ? (
          <div className="rounded-xl border border-[#D4AF37]/30 bg-[#101813] p-10 text-center text-[#D4AF37]">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-[#D4AF37]/30 bg-[#101813] p-10 text-center text-gray-400">
            No matching orders found.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <article
                key={order.id}
                className="rounded-xl border border-[#D4AF37]/30 bg-[#101813] p-6 shadow-xl hover:border-[#D4AF37]/60"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-[#D4AF37]">
                      {order.customer_name}
                    </h2>

                    <p className="mt-1 break-all text-xs text-gray-500">
                      Order ID: {order.id}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-4 py-2 text-sm font-bold ${statusStyle(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <p>
                    <span className="text-gray-400">Phone:</span>{" "}
                    {order.customer_phone}
                  </p>

                  <p>
                    <span className="text-gray-400">Order Date:</span>{" "}
                    {new Date(order.created_at).toLocaleString()}
                  </p>

                  <p className="sm:col-span-2">
                    <span className="text-gray-400">Delivery Address:</span>{" "}
                    {order.delivery_address}
                  </p>
                </div>

                <div className="mt-5 rounded-lg border border-[#D4AF37]/20 bg-[#123D2B] p-4">
                  <h3 className="mb-3 font-bold text-[#D4AF37]">
                    Ordered Products
                  </h3>

                  {order.order_items?.length ? (
                    <div className="space-y-3">
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-wrap justify-between gap-2 border-b border-white/10 pb-3 text-sm last:border-0 last:pb-0"
                        >
                          <div>
                            <p className="font-semibold text-white">
                              {item.product_name}
                            </p>

                            <p className="text-gray-400">
                              {formatPrice(Number(item.unit_price))} ×{" "}
                              {item.quantity}
                            </p>
                          </div>

                          <p className="font-bold text-[#D4AF37]">
                            {formatPrice(Number(item.subtotal))}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      No product details available.
                    </p>
                  )}

                  <div className="mt-4 flex justify-between border-t border-[#D4AF37]/30 pt-3">
                    <span className="font-bold">Order Total</span>

                    <span className="text-lg font-black text-[#D4AF37]">
                      {formatPrice(Number(order.total_amount))}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <select
                    value={draftStatuses[order.id] || "pending"}
                    onChange={(e) =>
                      setDraftStatuses((current) => ({
                        ...current,
                        [order.id]: e.target.value as OrderStatus,
                      }))
                    }
                    className="min-w-40 rounded-lg border border-[#D4AF37]/30 bg-[#080D0A] p-3 text-white outline-none focus:border-[#D4AF37]"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => updateStatus(order)}
                    disabled={
                      updatingId === order.id ||
                      draftStatuses[order.id] === order.status
                    }
                    className="rounded-lg bg-[#D4AF37] px-4 py-3 font-bold text-[#080D0A] hover:bg-[#E5C65B] disabled:opacity-40"
                  >
                    {updatingId === order.id
                      ? "Updating..."
                      : "Update Status"}
                  </button>

                  <a
                    href={getWhatsAppLink(order.customer_phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-[#D4AF37]/40 bg-[#123D2B] px-4 py-3 font-semibold text-white hover:bg-[#1B563D]"
                  >
                    Contact on WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
