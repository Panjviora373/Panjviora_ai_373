
"use client";

import { useState, type FormEvent } from "react";

type Order = {
  order_id: string;
  status: string;
  created_at: string;
  total_amount: number;
  customer_name: string;
  items: {
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }[];
};

const steps = ["pending", "confirmed", "shipped", "delivered"];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId.trim(),
          customer_phone: phone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order could not be found.");
      }

      setOrder(data.order);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  const currentStep = order ? steps.indexOf(order.status) : -1;

  return (
    <main className="min-h-screen bg-[#07130f] px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold tracking-[0.3em] text-yellow-500">
            ALIQO
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">
            Track Your Order
          </h1>
          <p className="mt-3 text-gray-400">
            Enter your order details to check your delivery status.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-yellow-700/30 bg-[#10231b] p-6 shadow-xl"
        >
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Order ID
            </label>
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your Order ID"
              required
              className="w-full rounded-lg border border-gray-700 bg-[#07130f] px-4 py-3 outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Phone Number
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter checkout phone number"
              required
              className="w-full rounded-lg border border-gray-700 bg-[#07130f] px-4 py-3 outline-none focus:border-yellow-500"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black transition hover:bg-yellow-400 disabled:opacity-50"
          >
            {loading ? "Checking Order..." : "Track Order"}
          </button>
        </form>

        {order && (
          <section className="mt-8 space-y-6 rounded-2xl border border-yellow-700/30 bg-[#10231b] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Order Details</h2>
              <span className="rounded-full bg-yellow-500/15 px-4 py-2 text-sm font-semibold capitalize text-yellow-400">
                {order.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-300">
              <p className="break-all">
                <strong className="text-white">Order ID:</strong>{" "}
                {order.order_id}
              </p>
              <p>
                <strong className="text-white">Customer:</strong>{" "}
                {order.customer_name}
              </p>
              <p>
                <strong className="text-white">Order Date:</strong>{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-bold text-yellow-400">
                Delivery Progress
              </h3>
              {order.status === "cancelled" ? (
                <p className="rounded-lg bg-red-500/10 p-4 font-semibold text-red-300">
                  This order has been cancelled.
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {steps.map((step, index) => {
                    const completed = currentStep >= index;
                    return (
                      <div key={step} className="text-center">
                        <div
                          className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                            completed
                              ? "bg-yellow-500 text-black"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {completed ? "✓" : index + 1}
                        </div>
                        <p
                          className={`text-xs capitalize ${
                            completed ? "text-yellow-400" : "text-gray-500"
                          }`}
                        >
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <h3 className="mb-3 font-bold text-yellow-400">
                Ordered Products
              </h3>
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between gap-4 border-b border-gray-700 py-3 text-sm"
                >
                  <div>
                    <p className="font-semibold">{item.product_name}</p>
                    <p className="text-gray-400">
                      Rs {Number(item.unit_price).toLocaleString()} ×{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    Rs {Number(item.subtotal).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-t border-yellow-700/30 pt-4 text-lg font-bold">
              <span>Order Total</span>
              <span className="text-yellow-400">
                Rs {Number(order.total_amount).toLocaleString()}
              </span>
            </div>
          </section>
        )}

        <div className="mt-8 text-center">
          <a
            href="/marketplace"
            className="text-sm text-yellow-400 hover:underline"
          >
            ← Continue Shopping
          </a>
        </div>
      </div>
    </main>
  );
}
