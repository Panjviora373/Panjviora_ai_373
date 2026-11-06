"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");

  function search(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (query.trim()) {
      window.location.href =
        "https://duckduckgo.com/?q=" +
        encodeURIComponent(query);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-white">
      <h1 className="text-5xl md:text-7xl font-bold mb-4">
        <span className="text-blue-400">PANJ</span>
        <span className="text-yellow-400">VIORA</span>
      </h1>

      <p className="text-yellow-400 mb-10 tracking-widest">
        AI 373
      </p>

      <form
        onSubmit={search}
        className="w-full max-w-2xl flex items-center bg-white rounded-full px-5 py-3 shadow-xl"
      >
        <span className="text-xl mr-3">🔍</span>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 outline-none text-black min-w-0"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-full"
        >
          Search
        </button>
      </form>

      <p className="mt-10 text-gray-400">
        Your World of Information
      </p>

      <p className="mt-3 text-gray-500 text-sm">
        Powered by PANJVIORA AI 373
      </p>
    </main>
  );
}