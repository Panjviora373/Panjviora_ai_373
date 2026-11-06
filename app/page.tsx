
"use client";

import { useState, type FormEvent } from "react";

type SearchResult = {
  title: string;
  url: string;
  content: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);
    setAnswer("");

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      setResults(Array.isArray(data.results) ? data.results : []);
      setAnswer(typeof data.answer === "string" ? data.answer : "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <header className="flex items-center justify-between px-6 py-5">
        <div className="text-xl font-bold tracking-tight">
          <span className="text-blue-600">PANJ</span>
          <span className="text-gray-800">VIORA</span>
          <span className="ml-2 text-xs text-blue-600">AI 373</span>
        </div>
        <span className="rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700">
          AI Search
        </span>
      </header>

      <section className="mx-auto flex max-w-4xl flex-col items-center px-5 pb-20 pt-20 md:pt-28">
        <h1 className="text-center text-5xl font-bold tracking-tight md:text-7xl">
          <span className="text-blue-600">PANJ</span>
          <span className="text-gray-800">VIORA</span>
        </h1>

        <p className="mt-4 text-lg text-gray-500">
          AI 373 · Your World of Information
        </p>

        <form
          onSubmit={search}
          className="mt-10 flex w-full max-w-2xl items-center rounded-full border border-gray-200 bg-white px-5 py-3 shadow-sm transition hover:shadow-lg focus-within:shadow-lg"
        >
          <span className="mr-3 text-xl text-gray-400">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything in the world..."
            className="min-w-0 flex-1 bg-transparent py-2 text-base text-gray-800 outline-none placeholder:text-gray-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {["AI Technology", "Science", "Education", "World News"].map((item) => (
            <button
              key={item}
              onClick={() => setQuery(item)}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:border-blue-300 hover:bg-blue-50"
            >
              {item}
            </button>
          ))}
        </div>

        {loading && (
          <p className="mt-10 text-blue-600">Searching the world...</p>
        )}

        {error && (
          <div className="mt-10 w-full rounded-xl bg-red-50 p-5 text-red-600">
            {error}
          </div>
        )}

        {answer && (
          <section className="mt-12 w-full rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-gray-900">
              AI Answer
            </h2>
            <p className="whitespace-pre-wrap leading-7 text-gray-600">
              {answer}
            </p>
          </section>
        )}

        {results.length > 0 && (
          <section className="mt-10 w-full">
            <h2 className="mb-6 text-xl font-bold text-gray-800">
              Search Results
            </h2>
            <div className="space-y-6">
              {results.map((item) => (
                <article
                  key={item.url}
                  className="rounded-xl border border-gray-100 p-5 transition hover:border-blue-200 hover:shadow-sm"
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-blue-700 hover:underline"
                  >
                    {item.title || item.url}
                  </a>
                  <p className="mt-2 break-words text-sm leading-6 text-gray-600">
                    {item.content}
                  </p>
                  <p className="mt-2 break-all text-xs text-green-700">
                    {item.url}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>

      <footer className="border-t border-gray-100 py-7 text-center text-sm text-gray-400">
        © 2026 PANJVIORA AI 373 · Search Beyond Limits
      </footer>
    </main>
  );
}
