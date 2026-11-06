
"use client";

import { useState, type FormEvent } from "react";

type SearchResult = {
  title: string;
  url: string;
  content: string;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: {
    results: ArrayLike<ArrayLike<{ transcript: string }>>;
  }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
};

const topics = [
  "Artificial Intelligence",
  "Technology",
  "Education",
  "Science",
  "Business",
  "World News",
];
const translations = {
  en: {
    heading: "Search Beyond Limits.",
    description:
{translations[language].description}
    placeholder: "Ask anything or search the web...",
    search: "Search →",
    searching: "Searching...",
    detailed: "Detailed AI Answer",
    quick: "Panjviora AI Answer",
    results: "Search Results",
  },
  ur: {
    heading: "لامحدود تلاش کریں۔",
    description:
      "علم دریافت کریں، معلومات تلاش کریں اور اپنے ذہین سرچ ساتھی سے جوابات حاصل کریں۔",
    placeholder: "اپنا سوال لکھیں یا ویب پر تلاش کریں...",
    search: "تلاش کریں ←",
    searching: "تلاش جاری ہے...",
    detailed: "تفصیلی اے آئی جواب",
    quick: "پنج ویورا اے آئی جواب",
    results: "تلاش کے نتائج",
  },
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<"en" | "ur">("en");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [answer, setAnswer] = useState("");
  const [detailedAnswer, setDetailedAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [listening, setListening] = useState(false);
const [voiceError, setVoiceError] = useState("");
  function startVoiceSearch() {
  setVoiceError("");

  const speechWindow = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };

  const SpeechRecognition =
    speechWindow.SpeechRecognition ||
    speechWindow.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    setVoiceError("Voice Search is not supported. Please use Google Chrome.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "ur-PK";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setQuery(transcript);
  };

  recognition.onerror = (event) => {
    setVoiceError("Microphone error: " + event.error);
    setListening(false);
  };

  recognition.onend = () => {
    setListening(false);
  };

  try {
    setListening(true);
    recognition.start();
  } catch {
    setListening(false);
    setVoiceError("Please try clicking the microphone again.");
  }
}
  async function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!query.trim() || loading) return;

    setLoading(true);
    setError("");
    setResults([]);
    setAnswer("");
setDetailedAnswer("");
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed. Please try again.");
      }

      setResults(Array.isArray(data.results) ? data.results : []);
     setAnswer(
  typeof data.quickAnswer === "string"
    ? data.quickAnswer
    : typeof data.answer === "string"
      ? data.answer
      : ""
);

setDetailedAnswer(
  typeof data.detailedAnswer === "string"
    ? data.detailedAnswer
    : ""
);

      if (!data.answer && (!data.results || data.results.length === 0)) {
        setError("No results found. Please try another search.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8faff] text-slate-800">
      {/* Navigation */}
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-xl font-black text-white shadow-lg">
              P
            </div>

            <div>
              <div className="text-lg font-extrabold tracking-tight">
                <span className="text-blue-600">PANJ</span>
                <span className="text-slate-900">VIORA</span>
              </div>
              <div className="text-[10px] font-bold tracking-[3px] text-violet-600">
                AI SEARCH 373
              </div>
            </div>
          </a>

          <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
            ✦ AI POWERED SEARCH
          </span>
        </div>
      </header>

      {/* Hero */}
      <section
  dir={language === "ur" ? "rtl" : "ltr"}
  className="mx-auto flex max-w-5xl flex-col items-center px-5 pb-20 pt-20 text-center md:pt-28"
>
        <div className="mb-6 flex gap-2">
  <button
    type="button"
    onClick={() => setLanguage("en")}
    className={`rounded-full px-5 py-2 text-sm font-bold ${
      language === "en"
        ? "bg-blue-600 text-white"
        : "border border-slate-200 bg-white text-slate-600"
    }`}
  >
    English
  </button>

  <button
    type="button"
    onClick={() => setLanguage("ur")}
    className={`rounded-full px-5 py-2 text-sm font-bold ${
      language === "ur"
        ? "bg-blue-600 text-white"
        : "border border-slate-200 bg-white text-slate-600"
    }`}
  >
    اردو
  </button>
</div>
        <div className="mb-7 rounded-full border border-blue-100 bg-white px-5 py-2 text-sm font-medium text-blue-700 shadow-sm">
          ✨ Discover a smarter way to search
        </div>

        <h1 className="text-5xl font-black tracking-tight sm:text-6xl md:text-8xl">
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            PANJVIORA
          </span>
        </h1>

        <p className="mt-5 text-sm font-bold tracking-[5px] text-slate-400 sm:text-base">
          AI SEARCH 373
        </p>

        <h2 className="mt-7 text-2xl font-bold text-slate-800 sm:text-3xl">
         {translations[language].heading}
        </h2>

        <p className="mt-3 max-w-xl text-base leading-7 text-slate-500">
          Explore knowledge, discover information and find answers
          with your intelligent search companion.
        </p>
{/* Detailed AI Answer */}
{detailedAnswer && (
  <section className="mt-6 w-full rounded-2xl border border-violet-100 bg-white p-6 text-left shadow-sm sm:p-8">
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-xl text-violet-700">
        ✨
      </div>

      <div>
        <h2 className="font-bold text-slate-900">
         {translations[language].detailed}
        </h2>
        <p className="text-xs text-violet-600">
          Explained by Panjviora AI
        </p>
      </div>
    </div>

    <p className="whitespace-pre-wrap text-sm leading-8 text-slate-600">
      {detailedAnswer}
    </p>
  </section>
)}
        {/* Search */}
        <form
          onSubmit={search}
          className="mt-10 flex w-full max-w-3xl items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_12px_50px_rgba(37,99,235,0.09)] transition focus-within:border-blue-400 focus-within:shadow-xl"
        >
          <span className="pl-3 text-2xl text-blue-500">⌕</span>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={translations[language].placeholder}
            className="min-w-0 flex-1 bg-transparent px-2 py-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
            required
          />
          <button
            type="button"
            onClick={startVoiceSearch}
            disabled={listening || loading}
            className="rounded-xl bg-violet-100 px-4 py-3 text-xl text-violet-700 transition hover:bg-violet-200 disabled:opacity-50"
            aria-label="Voice Search"
            title="Voice Search"
          >
            {listening ? "🔴" : "🎙️"}
          </button>
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="px-2 text-xl text-slate-400 hover:text-slate-700"
              aria-label="Clear search"
            >
              ×
            </button>
          )}

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-4 text-sm font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
          >
            {loading
  ? translations[language].searching
  : translations[language].search}
          </button>
        </form>
        {voiceError && (
          <p className="mt-3 text-sm text-red-600">
            {voiceError}
          </p>
        )}
        {/* Search Topics */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {topics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setQuery(topic)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 sm:text-sm"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-12 w-full rounded-2xl border border-blue-100 bg-white p-8 shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="font-semibold text-blue-700">
              Panjviora is searching...
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Discovering useful information for you.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-10 w-full rounded-xl border border-red-100 bg-red-50 p-5 text-left text-sm text-red-600">
            ⚠ {error}
          </div>
        )}

        {/* AI Answer */}
        {answer && (
          <section className="mt-12 w-full rounded-2xl border border-blue-100 bg-white p-6 text-left shadow-sm sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-xl text-white">
                ✦
              </div>
              <div>
                <h2 className="font-bold text-slate-900">
                  {translations[language].quick}
                </h2>
                <p className="text-xs text-blue-600">
                  Intelligent search response
                </p>
              </div>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-8 text-slate-600">
              {answer}
            </p>
          </section>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <section className="mt-12 w-full text-left">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
              {translations[language].results}
              </h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {results.length} Results
              </span>
            </div>

            <div className="space-y-4">
              {results.map((item, index) => (
                <article
                  key={`${item.url}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="mb-2 text-xs text-slate-400">
                    {(() => {
                      try {
                        return new URL(item.url).hostname;
                      } catch {
                        return "Search source";
                      }
                    })()}
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-blue-700 hover:text-violet-700 hover:underline"
                  >
                    {item.title || item.url}
                  </a>

                  <p className="mt-3 break-words text-sm leading-7 text-slate-600">
                    {item.content}
                  </p>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-xs font-semibold text-violet-600 hover:underline"
                  >
                    Visit Website →
                  </a>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>

      {/* Features */}
      <section className="border-y border-slate-200 bg-white px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Explore with Panjviora
            </h2>
            <p className="mt-3 text-slate-500">
              One platform. Endless possibilities.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: "✦",
                title: "AI Intelligence",
                description:
                  "Get helpful answers and explore information with AI.",
              },
              {
                icon: "⌕",
                title: "Smart Discovery",
                description:
                  "Explore useful websites and discover new information.",
              },
              {
                icon: "⚡",
                title: "Simple Experience",
                description:
                  "A clean, modern and easy-to-use search experience.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-100 bg-[#f8faff] p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-700">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#101a35] px-5 py-10 text-center text-white">
        <div className="text-xl font-extrabold">
          <span className="text-blue-400">PANJ</span>VIORA
          <span className="ml-2 text-xs text-violet-300">AI 373</span>
        </div>

        <p className="mt-3 text-sm text-slate-400">
          Your world of information, powered by intelligent search.
        </p>

        <nav className="mt-7 flex flex-wrap justify-center gap-6 text-sm">
          <a href="/" className="text-slate-300 hover:text-white">Home</a>
          <a href="/about" className="text-slate-300 hover:text-white">About Us</a>
          <a href="/privacy" className="text-slate-300 hover:text-white">Privacy Policy</a>
          <a href="/contact" className="text-slate-300 hover:text-white">Contact Us</a>
          <a href="/terms" className="text-slate-300 hover:text-white">Terms & Conditions</a>
        </nav>

        <div className="mt-7 border-t border-white/10 pt-6 text-xs text-slate-500">
          © 2026 Panjviora AI 373. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
