
"use client";

import { useEffect, useState } from "react";

type CartItem = {
  id: string;
  product_name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("aliqo_cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch {
      setCart([]);
    }
    setLoaded(true);
  }, []);

  function saveCart(updatedCart: CartItem[]) {
    setCart(updatedCart);
    localStorage.setItem("aliqo_cart", JSON.stringify(updatedCart));
  }

  function increaseQuantity(id: string) {
    const updated = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    saveCart(updated);
  }

  function decreaseQuantity(id: string) {
    const updated = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updated);
  }

  function removeItem(id: string) {
    saveCart(cart.filter((item) => item.id !== id));
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <main className="min-h-screen bg-[#050907] text-white">
      <header className="border-b border-[#c9a44c]/30 bg-[#08130e] px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="/" className="text-3xl font-black text-[#d6b45c]">
            ALIQO
          </a>
          <a
            href="/marketplace"
            className="rounded-full border border-[#d6b45c]/60 px-5 py-2 text-sm text-[#e6ca7a]"
          >
            Continue Shopping
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-10 text-4xl font-black text-[#d6b45c]">
          Shopping Cart
        </h1>

        {!loaded ? (
          <p className="text-gray-400">Loading your cart...</p>
        ) : cart.length === 0 ? (
          <div className="rounded-3xl border border-[#c9a44c]/25 bg-[#0b1711] p-12 text-center">
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="mt-3 text-gray-400">
              Explore ALIQO Marketplace and add products to your cart.
            </p>
            <a
              href="/marketplace"
              className="mt-7 inline-block rounded-xl bg-[#d6b45c] px-8 py-3 font-bold text-black"
            >
              Explore Marketplace
            </a>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 rounded-2xl border border-[#c9a44c]/25 bg-[#0b1711] p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#08130e]">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="font-black text-[#d6b45c]">
                        ALIQO
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-bold">
                      {item.product_name}
                    </h2>
                    <p className="mt-2 text-[#e4c46d]">
                      {formatPrice(Number(item.price))}
                    </p>

                    <div className="mt-4 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        className="h-9 w-9 rounded-lg border border-[#d6b45c]/50 text-xl text-[#e6ca7a]"
                      >
                        −
                      </button>

                      <span className="font-bold">{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        className="h-9 w-9 rounded-lg border border-[#d6b45c]/50 text-xl text-[#e6ca7a]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="font-bold text-[#e4c46d]">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="mt-4 text-sm text-red-400 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-[#c9a44c]/30 bg-[#0b1711] p-6">
              <h2 className="text-xl font-bold text-[#d6b45c]">
                Order Summary
              </h2>

              <div className="mt-6 flex justify-between text-gray-400">
                <span>Items</span>
                <span>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>

              <div className="mt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[#e4c46d]">
                  {formatPrice(total)}
                </span>
              </div>

              <a
  href="/checkout"
  className="mt-8 block w-full rounded-xl bg-[#d6b45c] px-5 py-4 text-center font-bold text-black transition hover:bg-[#e6ca7a]"
>
  Proceed to Checkout
</a>

              <p className="mt-3 text-center text-xs text-gray-500">
                Secure checkout will be available soon.
              </p>
            </aside>
          </div>
        )}
      </section>

      <footer className="border-t border-[#c9a44c]/20 bg-[#08130e] px-6 py-8 text-center text-sm text-gray-500">
        © 2026 ALIQO. All rights reserved.
      </footer>
    </main>
  );
}
