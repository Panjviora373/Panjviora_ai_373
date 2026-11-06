
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
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold md:text-7xl">
            <span className="text-blue-400">PANJ</span>
            <span className="text-yellow-400">VIORA</span>
          </h1>
          <p className="mt-3 tracking-widest text-yellow-400">AI 373</p>
          <p className="mt-5 text-gray-400">
            Your World of Information
          </p>
        </div>

        <form
          onSubmit={search}
          className="flex w-full items-center rounded-full bg-white px-5 py-3 shadow-xl"
        >
          <span className="mr-3 text-xl">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
            className="min-w-0 flex-1 text-black outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-blue-600 px-5 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {loading && (
          <p className="mt-8 text-center text-blue-300">
            Searching the web...
          </p>
        )}

        {error && (
          <p className="mt-8 rounded-lg bg-red-900 p-4 text-red-200">
            {error}
          </p>
        )}

        {answer && (
          <section className="mt-8 rounded-xl bg-slate-800 p-5">
            <h2 className="mb-3 text-xl font-bold text-yellow-400">
              AI Answer
            </h2>
            <p className="whitespace-pre-wrap text-gray-200">{answer}</p>
          </section>
        )}

        {results.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-white">
              Search Results
            </h2>
            <div className="space-y-5">
              {results.map((item) => (
                <article
                  key={item.url}
                  className="rounded-xl bg-slate-800 p-5"
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-blue-300 hover:underline"
                  >
                    {item.title || item.url}
                  </a>
                  <p className="mt-2 break-words text-sm text-gray-300">
                    {item.content}
                  </p>
                  <p className="mt-2 break-all text-xs text-gray-500">
                    {item.url}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        <p className="mt-12 text-center text-sm text-gray-500">
          Powered by PANJVIORA AI 373
        </p>
      </div>
    </main>
  );
}
