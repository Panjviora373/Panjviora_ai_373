
"use client";

import { useState } from "react";

type CartItem = {
  id: string;
  product_name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

type Props = {
  product: {
    id: string;
    product_name: string;
    price: number;
    image_url: string | null;
    stock_quantity: number;
  };
};

export default function AddToCartButton({ product }: Props) {
  const [message, setMessage] = useState("");

  function addToCart() {
    try {
      const savedCart = localStorage.getItem("aliqo_cart");
      const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

      const existingItem = cart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        if (existingItem.quantity >= product.stock_quantity) {
          setMessage("Available stock limit reached.");
          return;
        }

        existingItem.quantity += 1;
      } else {
        if (product.stock_quantity <= 0) {
          setMessage("This product is out of stock.");
          return;
        }

        cart.push({
          id: product.id,
          product_name: product.product_name,
          price: Number(product.price),
          image_url: product.image_url,
          quantity: 1,
        });
      }

      localStorage.setItem("aliqo_cart", JSON.stringify(cart));
      setMessage("Product added to your cart!");
    } catch {
      setMessage("Could not add product. Please try again.");
    }
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={addToCart}
        disabled={product.stock_quantity <= 0}
        className="w-full rounded-xl bg-[#d6b45c] px-8 py-4 font-bold text-black transition hover:bg-[#e6ca7a] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock"}
      </button>

      {message && (
        <p className="mt-3 text-sm text-[#e6ca7a]" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
