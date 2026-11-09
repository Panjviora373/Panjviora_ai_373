
"use client";

import { useState, type FormEvent } from "react";

type SearchMode = "web" | "images" | "videos" | "ai";

type SearchResult = {
  title: string;
  url: string;
  content: string;
};

type ImageResult = {
  url: string;
  thumbnail?: string;
  pageUrl?: string;
  description: string;
  source?: string;
};

type VideoResult = {
  title: string;
  url: string;
  description: string;
  thumbnail: string;
  source: string;
  channelTitle?: string;
  kind?: string;
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
  "Technology",
  "Education",
  "Science",
  "Business",
  "World News",
  "History",
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
    loading: "Searching...",
    loadingDescription: "Finding useful information for you.",
    visit: "Visit Website",
    popular: "Explore popular topics",
    features: "Discover a better way to search",
    featuresDescription: "Everything you need to explore information.",
    smartTitle: "Helpful Answers",
    smartDescription: "Understand topics with clear and useful answers.",
    discoveryTitle: "Web Discovery",
    discoveryDescription:
      "Find websites and explore information from across the web.",
    simpleTitle: "Simple Experience",
    simpleDescription:
      "A clean, easy and comfortable search experience.",
    footer: "Explore more. Discover more.",
    home: "Home",
    about: "About Us",
    privacy: "Privacy Policy",
    contact: "Contact",
    terms: "Terms & Conditions",
    voiceError:
      "Voice search is not supported. Please use Google Chrome.",
    noResults: "No results found. Please try another search.",
    web: "Web",
    images: "Images",
    videos: "Videos",
    ai: "AI Search",
    imageResults: "Image Results",
    videoResults: "Video Results",
    noImages: "No images found. Try another search.",
    noVideos: "No videos found. Try another search.",
    youtube: "YouTube",
    otherWebsite: "Other Website",
    channel: "Channel",
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
    loading: "تلاش جاری ہے...",
    loadingDescription: "آپ کے لیے مفید معلومات تلاش کی جا رہی ہیں۔",
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
    web: "ویب",
    images: "تصاویر",
    videos: "ویڈیوز",
    ai: "اے آئی سرچ",
    imageResults: "تصاویر کے نتائج",
    videoResults: "ویڈیوز کے نتائج",
    noImages: "کوئی تصویر نہیں ملی۔ دوبارہ تلاش کریں۔",
    noVideos: "کوئی ویڈیو نہیں ملی۔ دوبارہ تلاش کریں۔",
    youtube: "یوٹیوب",
    otherWebsite: "دوسری ویب سائٹ",
    channel: "چینل",
  },
};

const goldButton =
  "bg-gradient-to-r from-[#C49A32] to-[#E7C766] text-[#101710] shadow-lg shadow-yellow-900/10 hover:brightness-105";

const greenButton =
  "bg-[#173B2B] text-[#F3D77C] hover:bg-[#20533B]";

const cardStyle =
  "rounded-3xl border border-[#D9E2D8] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#C49A32] hover:shadow-xl";

export default function Home() {
  const [query, setQuery] = useState("");
  
  const [language, setLanguage] = useState<"en" | "ur">("en");
  const [mode, setMode] = useState<SearchMode>("web");

  const [results, setResults] = useState<SearchResult[]>([]);
  const [images, setImages] = useState<ImageResult[]>([]);
  const [videos, setVideos] = useState<VideoResult[]>([]);

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

    recognition.onend = () => setListening(false);

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
    setImages([]);
    setVideos([]);
    setAnswer("");
    setDetailedAnswer("");

    try {
      const apiMode = mode === "ai" ? "web" : mode;

      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          mode: apiMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed. Please try again.");
      }

      const searchResults = Array.isArray(data.results)
        ? data.results
        : [];

      const imageResults = Array.isArray(data.images)
        ? data.images
        : [];

      const videoResults = Array.isArray(data.videos)
        ? data.videos
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
      setImages(imageResults);
      setVideos(videoResults);
      setAnswer(quickAnswer);
      setDetailedAnswer(longAnswer);

      const hasResults =
        mode === "images"
          ? imageResults.length > 0
          : mode === "videos"
            ? videoResults.length > 0
            : searchResults.length > 0 || quickAnswer || longAnswer;

      if (!hasResults) {
        setError(
          mode === "images"
            ? t.noImages
            : mode === "videos"
              ? t.noVideos
              : t.noResults
        );
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

  const searchTabs: {
    id: SearchMode;
    label: string;
    icon: string;
  }[] = [
    { id: "web", label: t.web, icon: "⌕" },
    { id: "images", label: t.images, icon: "▧" },
    { id: "videos", label: t.videos, icon: "▶" },
    { id: "ai", label: t.ai, icon: "✦" },
  ];

  return (
    <main
      className="min-h-screen overflow-hidden bg-[#F3F6F1] text-[#18271D]"
      dir={language === "ur" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#D7E0D5] bg-[#10271D]/95 text-white shadow-lg backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E1C15B] bg-gradient-to-br from-[#D8B64F] to-[#A77B20] text-2xl font-black text-[#10271D] shadow-lg">
              A
            </div>

            <div>
              <div className="text-xl font-black tracking-tight text-white">
                ALI<span className="text-[#E4C35D]">QO</span>
              </div>
              <div className="text-[9px] font-bold tracking-[0.25em] text-[#C9D5CA]">
                DISCOVER MORE
              </div>
            </div>
          </a>

          <div className="flex items-center gap-2">
            <a
              href="/deals"
              className="rounded-full border border-[#B9953B]/50 bg-[#D4AF37]/10 px-4 py-2 text-xs font-bold text-[#F0D77F] transition hover:bg-[#D4AF37]/20"
            >
              Deals
            </a>

            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                language === "en"
                  ? "bg-[#D4AF37] text-[#10271D]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              EN
            </button>

            <button
              type="button"
              onClick={() => setLanguage("ur")}
              className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                language === "ur"
                  ? "bg-[#D4AF37] text-[#10271D]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              اردو
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-5 pb-20 pt-16 text-center sm:pt-24 md:pb-28 md:pt-28">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[450px] w-[850px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#D4AF37]/20 via-[#B5C9A9]/30 to-[#173B2B]/15 blur-[100px]" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white/90 px-5 py-2.5 text-xs font-bold tracking-wide text-[#173B2B] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#C49A32]" />
            {t.discover}
          </div>

          <h1 className="text-6xl font-black tracking-[-0.06em] sm:text-7xl md:text-9xl">
            <span className="bg-gradient-to-r from-[#173B2B] via-[#316344] to-[#C49A32] bg-clip-text text-transparent">
              ALIQO
            </span>
          </h1>

          <h2 className="mt-7 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#10271D] sm:text-4xl md:text-5xl">
            {t.heading}
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[#647468] sm:text-lg">
            {t.description}
          </p>

          {/* Search Tabs */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {searchTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setMode(tab.id);
                  setError("");
                  setResults([]);
                  setImages([]);
                  setVideos([]);
                  setAnswer("");
                  setDetailedAnswer("");
                }}
                className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${
                  mode === tab.id
                    ? `${greenButton} shadow-lg shadow-green-900/20`
                    : "border border-[#D5DED2] bg-white text-[#405447] hover:border-[#C49A32] hover:bg-[#F8F3E5] hover:text-[#173B2B]"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form
            onSubmit={search}
            className="mt-5 flex w-full max-w-3xl flex-col gap-2 rounded-[26px] border border-[#D5DED2] bg-white p-2 shadow-[0_20px_70px_rgba(23,59,43,0.12)] transition focus-within:border-[#C49A32] focus-within:shadow-[0_20px_80px_rgba(196,154,50,0.16)] sm:flex-row sm:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center">
              <span className="px-3 text-2xl text-[#B58B2B]">⌕</span>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.placeholder}
                className="min-w-0 flex-1 bg-transparent px-2 py-4 text-sm text-[#18271D] outline-none placeholder:text-[#9AA79B] sm:text-base"
                required
                aria-label="Search"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="px-3 text-xl text-[#8A998D] transition hover:text-[#10271D]"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

              <button
                type="button"
                onClick={startVoiceSearch}
                disabled={listening || loading}
                className="mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF0E8] text-xl text-[#173B2B] transition hover:bg-[#DCE8D9] disabled:opacity-50"
                aria-label="Voice Search"
                title="Voice Search"
              >
                {listening ? "🔴" : "🎙"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={`rounded-2xl px-8 py-4 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 ${goldButton}`}
            >
              {loading ? t.searching : t.search + " →"}
            </button>
          </form>

          {voiceError && (
            <p className="mt-3 text-sm text-red-600">{voiceError}</p>
          )}

          {/* Popular Topics */}
          <div className="mt-10 w-full max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#7C8C7D]">
              {t.popular}
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => {
                    setQuery(topic);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="rounded-full border border-[#D5DED2] bg-white/90 px-4 py-2.5 text-xs font-semibold text-[#526456] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C49A32] hover:bg-[#F8F3E5] hover:text-[#173B2B] sm:text-sm"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mt-12 w-full rounded-3xl border border-[#D4AF37]/40 bg-white p-10 shadow-lg">
              <div className="mx-auto mb-5 h-11 w-11 animate-spin rounded-full border-4 border-[#E8EEDF] border-t-[#C49A32]" />
              <p className="font-bold text-[#173B2B]">{t.loading}</p>
              <p className="mt-2 text-sm text-[#829084]">
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

          {/* AI Answers */}
          {(mode === "ai" || mode === "web") && (
            <>
              {detailedAnswer && (
                <section className="mt-12 w-full rounded-3xl border border-[#D4AF37]/40 bg-white p-6 text-left shadow-lg sm:p-9">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7F0D9] text-2xl text-[#9A741D]">
                      ✨
                    </div>
                    <div>
                      <h2 className="font-extrabold text-[#10271D]">
                        {t.detailed}
                      </h2>
                      <p className="mt-1 text-xs font-medium text-[#A17C26]">
                        Explained by ALIQO
                      </p>
                    </div>
                  </div>

                  <p className="whitespace-pre-wrap text-sm leading-8 text-[#536457]">
                    {detailedAnswer}
                  </p>
                </section>
              )}

              {answer && (
                <section className="mt-8 w-full rounded-3xl border border-[#D9E2D8] bg-white p-6 text-left shadow-lg sm:p-9">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173B2B] text-2xl text-[#E4C35D]">
                      ✦
                    </div>
                    <div>
                      <h2 className="font-extrabold text-[#10271D]">
                        {t.quick}
                      </h2>
                      <p className="mt-1 text-xs font-medium text-[#A17C26]">
                        ALIQO Search
                      </p>
                    </div>
                  </div>

                  <p className="whitespace-pre-wrap text-sm leading-8 text-[#536457]">
                    {answer}
                  </p>
                </section>
              )}
            </>
          )}

          {/* Image Results */}
          {mode === "images" && images.length > 0 && (
            <section className="mt-12 w-full text-left">
              <h2 className="mb-6 text-xl font-extrabold text-[#10271D]">
                {t.imageResults} ({images.length})
              </h2>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {images.map((image, index) => (
                  <a
                    key={`${image.url}-${index}`}
                    href={image.pageUrl || image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group overflow-hidden rounded-2xl border border-[#D9E2D8] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#C49A32] hover:shadow-xl"
                  >
                    <div className="aspect-square overflow-hidden bg-[#E9EFE7]">
                      <img
                        src={image.thumbnail || image.url}
                        alt={image.description || "Search image"}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <p className="line-clamp-2 p-3 text-xs font-semibold text-[#526456]">
                      {image.description || "Search image"}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Video Results */}
          {mode === "videos" && videos.length > 0 && (
            <section className="mt-12 w-full text-left">
              <h2 className="mb-6 text-xl font-extrabold text-[#10271D]">
                {t.videoResults} ({videos.length})
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                {videos.map((video, index) => (
                  <article
                    key={`${video.url}-${index}`}
                    className={cardStyle}
                  >
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {video.thumbnail ? (
                        <div className="relative aspect-video overflow-hidden rounded-t-3xl bg-[#E9EFE7]">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/10 text-5xl text-white">
                            ▶
                          </span>
                        </div>
                      ) : (
                        <div className="flex aspect-video items-center justify-center rounded-t-3xl bg-gradient-to-br from-[#E7EEDF] to-[#D4AF37]/30 text-6xl text-[#173B2B]">
                          ▶
                        </div>
                      )}

                      <div className="p-5">
                        <span className="mb-3 inline-flex rounded-full bg-[#F7F0D9] px-3 py-1 text-xs font-bold text-[#85631B]">
                          {video.source === "YouTube"
                            ? t.youtube
                            : t.otherWebsite}
                        </span>

                        <h3 className="font-extrabold leading-6 text-[#10271D] hover:text-[#9A741D]">
                          {video.title}
                        </h3>

                        {video.channelTitle && (
                          <p className="mt-2 text-xs font-semibold text-[#A17C26]">
                            {t.channel}: {video.channelTitle}
                          </p>
                        )}

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#647468]">
                          {video.description}
                        </p>

                        <span className={`mt-4 inline-flex rounded-full px-4 py-2 text-xs font-bold ${greenButton}`}>
                          Watch Video ↗
                        </span>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Web Results */}
          {mode === "web" && results.length > 0 && (
            <section className="mt-12 w-full text-left">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-[#10271D]">
                  {t.results}
                </h2>
                <span className="rounded-full bg-[#E8EEDF] px-4 py-2 text-xs font-bold text-[#173B2B]">
                  {results.length} results
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
                      className="rounded-3xl border border-[#D9E2D8] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#C49A32] hover:shadow-xl sm:p-8"
                    >
                      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#829084]">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8EEDF] text-[#173B2B]">
                          ↗
                        </span>
                        {hostname}
                      </div>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-words text-lg font-bold text-[#173B2B] transition hover:text-[#A17C26] hover:underline"
                      >
                        {item.title || item.url}
                      </a>

                      <p className="mt-3 break-words text-sm leading-7 text-[#647468]">
                        {item.content}
                      </p>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#E8EEDF] px-4 py-2 text-xs font-bold text-[#173B2B] transition hover:bg-[#DCE8D9]"
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
      
{/* Approved Advertisements */}
{approvedAds.length > 0 && (
  <section className="bg-[#F3F6F1] px-5 py-12">
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A17C26]">
          ALIQO BUSINESS PARTNERS
        </span>
        <h2 className="mt-3 text-3xl font-black text-[#10271D]">
          Featured Advertisements
        </h2>
        <p className="mt-3 text-sm text-[#647468]">
          Discover businesses featured on ALIQO.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {approvedAds.map((ad) => (
          <article
            key={ad.id}
            className="rounded-3xl border border-[#D9E2D8] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#C49A32] hover:shadow-xl"
          >
            <div className="mb-5 inline-flex rounded-full bg-[#F7F0D9] px-3 py-1 text-xs font-bold text-[#85631B]">
              Featured Business
            </div>

            <h3 className="text-xl font-extrabold text-[#173B2B]">
              {ad.business_name}
            </h3>

            <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-[#647468]">
              {ad.advertising_details}
            </p>

            <div className="mt-6 border-t border-[#E5EBE3] pt-4 text-xs text-[#829084]">
              Featured on ALIQO
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
)}

      <section className="border-y border-[#D9E2D8] bg-white px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A17C26]">
              THE ALIQO EXPERIENCE
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-[#10271D] sm:text-4xl">
              {t.features}
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#647468] sm:text-base">
              {t.featuresDescription}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: "✦",
                title: t.smartTitle,
                description: t.smartDescription,
                color: "from-[#173B2B] to-[#316344]",
                background: "bg-[#E8EEDF]",
              },
              {
                icon: "⌕",
                title: t.discoveryTitle,
                description: t.discoveryDescription,
                color: "from-[#A17C26] to-[#D4AF37]",
                background: "bg-[#F7F0D9]",
              },
              {
                icon: "⚡",
                title: t.simpleTitle,
                description: t.simpleDescription,
                color: "from-[#10271D] to-[#49765A]",
                background: "bg-[#E8EEDF]",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-3xl border border-[#E1E8DF] bg-[#F8FAF6] p-8 transition duration-300 hover:-translate-y-2 hover:border-[#C49A32] hover:bg-white hover:shadow-[0_20px_60px_rgba(23,59,43,0.10)]"
              >
                <div
                  className={`mb-7 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.background} text-2xl text-[#173B2B] transition group-hover:scale-110`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-lg font-extrabold text-[#10271D]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#647468]">
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
      <footer className="bg-[#090F0B] px-5 pb-8 pt-14 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2">
            <div>
              <a href="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4AF37] bg-gradient-to-br from-[#D8B64F] to-[#A77B20] text-xl font-black text-[#10271D]">
                  A
                </div>
                <span className="text-2xl font-black tracking-tight">
                  ALI<span className="text-[#E4C35D]">QO</span>
                </span>
              </a>

              <p className="mt-5 max-w-sm text-sm leading-7 text-[#A9B7AA]">
                {t.footer}
              </p>
            </div>

            <nav className="flex flex-wrap content-start gap-x-7 gap-y-4 text-sm">
              <a href="/" className="text-[#C4D0C5] transition hover:text-[#E4C35D]">
                {t.home}
              </a>
              <a href="/deals" className="text-[#C4D0C5] transition hover:text-[#E4C35D]">
                Deals
                <a
  href="/advertise"
  className="text-[#C4D0C5] transition hover:text-[#E4C35D]"
>
  Advertise With Us
</a>
              </a>
              <a href="/about" className="text-[#C4D0C5] transition hover:text-[#E4C35D]">
                {t.about}
              </a>
              <a href="/privacy" className="text-[#C4D0C5] transition hover:text-[#E4C35D]">
                {t.privacy}
              </a>
              <a href="/contact" className="text-[#C4D0C5] transition hover:text-[#E4C35D]">
                {t.contact}
              </a>
              <a href="/terms" className="text-[#C4D0C5] transition hover:text-[#E4C35D]">
                {t.terms}
              </a>
            </nav>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 pt-7 text-xs text-[#87958A] sm:flex-row">
            <p>© 2026 ALIQO. All rights reserved.</p>
            <p>Explore more. Discover more.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
