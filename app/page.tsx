
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
  { name: "Technology", icon: "⌘" },
  { name: "Education", icon: "▤" },
  { name: "Science", icon: "✧" },
  { name: "Business", icon: "▣" },
  { name: "World News", icon: "◎" },
  { name: "History", icon: "◷" },
];

const translations = {
  en: {
    heading: "Search beyond limits.",
    description:
      "Explore knowledge, discover information and find answers from across the web.",
    placeholder: "What would you like to discover today?",
    search: "Search",
    searching: "Searching...",
    detailed: "Detailed Answer",
    quick: "ALIQO Answer",
    results: "Search Results",
    discover: "A smarter way to explore the world",
    loading: "Searching across the web...",
    loadingDescription: "Finding useful information for you.",
    resultCount: "results found",
    visit: "Visit Website",
    popular: "Explore popular topics",
    features: "Discover a better way to search",
    featuresDescription: "Everything you need to explore information.",
    smartTitle: "Helpful Answers",
    smartDescription: "Understand topics with clear and useful answers.",
    discoveryTitle: "Web Discovery",
    discoveryDescription: "Find websites and explore information from across the web.",
    simpleTitle: "Simple Experience",
    simpleDescription: "A clean, easy and comfortable search experience.",
    footer: "Explore more. Discover more.",
    home: "Home",
    about: "About Us",
    privacy: "Privacy Policy",
    contact: "Contact",
    terms: "Terms & Conditions",
    voiceError: "Voice search is not supported. Please use Google Chrome.",
    noResults: "No results found. Please try another search.",
  },
  ur: {
    heading: "لامحدود تلاش کریں۔",
    description:
      "دنیا بھر کی معلومات دریافت کریں، علم حاصل کریں اور اپنے سوالات کے جواب تلاش کریں۔",
    placeholder: "آج آپ کیا دریافت کرنا چاہتے ہیں؟",
    search: "تلاش کریں",
    searching: "تلاش جاری ہے...",
    detailed: "تفصیلی جواب",
    quick: "ALIQO کا جواب",
    results: "تلاش کے نتائج",
    discover: "دنیا کو دریافت کرنے کا ایک بہتر انداز",
    loading: "ویب پر تلاش جاری ہے...",
    loadingDescription: "آپ کے لیے مفید معلومات تلاش کی جا رہی ہیں۔",
    resultCount: "نتائج ملے",
    visit: "ویب سائٹ دیکھیں",
    popular: "مشہور موضوعات دریافت کریں",
    features: "تلاش کا ایک بہتر تجربہ",
    featuresDescription: "معلومات دریافت کرنے کے لیے ایک آسان پلیٹ فارم۔",
    smartTitle: "مفید جوابات",
    smartDescription: "واضح اور مفید جوابات کے ذریعے موضوعات کو سمجھیں۔",
    discoveryTitle: "ویب کی دریافت",
    discoveryDescription: "دنیا بھر کی ویب سائٹس اور معلومات تلاش کریں۔",
    simpleTitle: "آسان تجربہ",
    simpleDescription: "ایک صاف ستھرا اور آسان سرچ کا تجربہ۔",
    footer: "مزید تلاش کریں۔ مزید دریافت کریں۔",
    home: "ہوم",
    about: "ہمارے بارے میں",
    privacy: "پرائیویسی پالیسی",
    contact: "رابطہ",
    terms: "شرائط و ضوابط",
    voiceError: "وائس سرچ کے لیے Google Chrome استعمال کریں۔",
    noResults: "کوئی نتیجہ نہیں ملا۔ دوبارہ تلاش کریں۔",
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

  const t = translations[language];

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
      setVoiceError(t.voiceError);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = language === "ur" ? "ur-PK" : "en-US";
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

      const searchResults = Array.isArray(data.results)
        ? data.results
        : [];

      const quickAnswer =
        typeof data.quickAnswer === "string"
          ? data.quickAnswer
          : typeof data.answer === "string"
            ? data.answer
            : "";

      const longAnswer =
        typeof data.detailedAnswer === "string"
          ? data.detailedAnswer
          : "";

      setResults(searchResults);
      setAnswer(quickAnswer);
      setDetailedAnswer(longAnswer);

      if (!quickAnswer && !longAnswer && searchResults.length === 0) {
        setError(t.noResults);
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
    <main
      className="min-h-screen overflow-hidden bg-[#f7f9ff] text-slate-800"
      dir={language === "ur" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-2xl font-black text-white shadow-lg shadow-blue-200">
              A
            </div>

            <div>
              <div className="text-xl font-black tracking-tight text-slate-900">
                ALI<span className="text-blue-600">QO</span>
              </div>
              <div className="text-[9px] font-bold tracking-[0.25em] text-slate-400">
                DISCOVER MORE
              </div>
            </div>
          </a>

          <div className="flex items-center gap-2">
            <a
  href="/deals"
  className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
>
  Deals
</a>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                language === "en"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              EN
            </button>

            <button
              type="button"
              onClick={() => setLanguage("ur")}
              className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                language === "ur"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              اردو
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-5 pb-20 pt-16 text-center sm:pt-24 md:pb-28 md:pt-28">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[450px] w-[850px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-100/70 via-violet-100/50 to-cyan-100/70 blur-[100px]" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-5 py-2.5 text-xs font-bold tracking-wide text-blue-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            {t.discover}
          </div>

          <h1 className="text-6xl font-black tracking-[-0.06em] sm:text-7xl md:text-9xl">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              ALIQO
            </span>
          </h1>

          <h2 className="mt-7 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            {t.heading}
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
            {t.description}
          </p>

          {/* Search Form */}
          <form
            onSubmit={search}
            className="mt-10 flex w-full max-w-3xl flex-col gap-2 rounded-[26px] border border-slate-200/80 bg-white p-2 shadow-[0_20px_70px_rgba(37,99,235,0.13)] transition focus-within:border-blue-300 focus-within:shadow-[0_20px_80px_rgba(37,99,235,0.20)] sm:flex-row sm:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center">
              <span className="px-3 text-2xl text-blue-500">⌕</span>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.placeholder}
                className="min-w-0 flex-1 bg-transparent px-2 py-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
                required
                aria-label="Search"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="px-3 text-xl text-slate-400 transition hover:text-slate-800"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

              <button
                type="button"
                onClick={startVoiceSearch}
                disabled={listening || loading}
                className="mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-xl text-violet-700 transition hover:bg-violet-100 disabled:opacity-50"
                aria-label="Voice Search"
                title="Voice Search"
              >
                {listening ? "🔴" : "🎙"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? t.searching : t.search + " →"}
            </button>
          </form>

          {voiceError && (
            <p className="mt-3 text-sm text-red-600">{voiceError}</p>
          )}

          <div className="mt-10 w-full max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              {t.popular}
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {topics.map((topic) => (
                <button
                  key={topic.name}
                  type="button"
                  onClick={() => {
                    setQuery(topic.name);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 sm:text-sm"
                >
                  <span className="text-blue-600">{topic.icon}</span>
                  {topic.name}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mt-12 w-full rounded-3xl border border-blue-100 bg-white p-10 shadow-lg">
              <div className="mx-auto mb-5 h-11 w-11 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
              <p className="font-bold text-blue-700">{t.loading}</p>
              <p className="mt-2 text-sm text-slate-400">
                {t.loadingDescription}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-8 w-full rounded-2xl border border-red-100 bg-red-50 p-5 text-left text-sm text-red-700">
              ⚠ {error}
            </div>
          )}

          {/* Detailed Answer */}
          {detailedAnswer && (
            <section className="mt-12 w-full rounded-3xl border border-violet-100 bg-white p-6 text-left shadow-lg shadow-violet-100/40 sm:p-9">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-2xl text-violet-700">
                  ✨
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900">
                    {t.detailed}
                  </h2>
                  <p className="mt-1 text-xs font-medium text-violet-600">
                    Explained by ALIQO
                  </p>
                </div>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-8 text-slate-600">
                {detailedAnswer}
              </p>
            </section>
          )}

          {/* Quick Answer */}
          {answer && (
            <section className="mt-8 w-full rounded-3xl border border-blue-100 bg-white p-6 text-left shadow-lg shadow-blue-100/40 sm:p-9">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-2xl text-white">
                  ✦
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900">
                    {t.quick}
                  </h2>
                  <p className="mt-1 text-xs font-medium text-blue-600">
                    ALIQO Search
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
                <h2 className="text-xl font-extrabold text-slate-900">
                  {t.results}
                </h2>
                <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700">
                  {results.length} {t.resultCount}
                </span>
              </div>

              <div className="space-y-4">
                {results.map((item, index) => {
                  let hostname = "Search source";

                  try {
                    hostname = new URL(item.url).hostname;
                  } catch {
                    hostname = "Search source";
                  }

                  return (
                    <article
                      key={`${item.url}-${index}`}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl sm:p-8"
                    >
                      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-400">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          ↗
                        </span>
                        {hostname}
                      </div>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-words text-lg font-bold text-blue-700 transition hover:text-violet-700 hover:underline"
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
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                      >
                        {t.visit} <span>↗</span>
                      </a>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-slate-200/70 bg-white px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              THE ALIQO EXPERIENCE
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {t.features}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              {t.featuresDescription}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: "✦",
                title: t.smartTitle,
                description: t.smartDescription,
                color: "from-blue-500 to-indigo-600",
                background: "bg-blue-50",
              },
              {
                icon: "⌕",
                title: t.discoveryTitle,
                description: t.discoveryDescription,
                color: "from-violet-500 to-purple-600",
                background: "bg-violet-50",
              },
              {
                icon: "⚡",
                title: t.simpleTitle,
                description: t.simpleDescription,
                color: "from-cyan-500 to-blue-600",
                background: "bg-cyan-50",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-3xl border border-slate-100 bg-[#fbfcff] p-8 transition duration-300 hover:-translate-y-2 hover:border-blue-100 hover:bg-white hover:shadow-[0_20px_60px_rgba(37,99,235,0.10)]"
              >
                <div
                  className={`mb-7 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.background} text-2xl text-blue-700 transition group-hover:scale-110`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-lg font-extrabold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {feature.description}
                </p>

                <div
                  className={`mt-7 h-1 w-12 rounded-full bg-gradient-to-r ${feature.color}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#101a35] px-5 pb-8 pt-14 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2">
            <div>
              <a href="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-xl font-black">
                  A
                </div>
                <span className="text-2xl font-black tracking-tight">
                  ALI<span className="text-blue-400">QO</span>
                </span>
              </a>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                {t.footer}
              </p>
            </div>

            <nav className="flex flex-wrap content-start gap-x-7 gap-y-4 text-sm">
              <a href="/" className="text-slate-300 transition hover:text-white">
                {t.home}
              </a>
              <a
  href="/deals"
  className="text-slate-300 transition hover:text-white"
>
  Deals
</a>
              <a href="/about" className="text-slate-300 transition hover:text-white">
                {t.about}
              </a>
              <a href="/privacy" className="text-slate-300 transition hover:text-white">
                {t.privacy}
              </a>
              <a href="/contact" className="text-slate-300 transition hover:text-white">
                {t.contact}
              </a>
              <a href="/terms" className="text-slate-300 transition hover:text-white">
                {t.terms}
              </a>
            </nav>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 pt-7 text-xs text-slate-500 sm:flex-row">
            <p>© 2026 ALIQO. All rights reserved.</p>
            <p>Explore more. Discover more.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
