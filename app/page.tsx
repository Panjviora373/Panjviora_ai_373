
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
    description: "Explore knowledge, discover information and find answers with your intelligent search companion.",
    placeholder: "Ask anything or search the web...",
    search: "Search →",
    searching: "Searching...",
    detailed: "Detailed AI Answer",
    quick: "Panjviora AI Answer",
    results: "Search Results",
  },
  ur: {
    heading: "لامحدود تلاش کریں۔",
    description: "علم دریافت کریں، معلومات تلاش کریں اور اپنے ذہین سرچ ساتھی سے جوابات حاصل کریں۔",
    placeholder: "اپنا سوال لکھیں یا ویب پر تلاش کریں...",
    search: "تلاش کریں ←",
    searching: "تلاش جاری ہے...",
    detailed: "تفصیلی اے آئی جواب",
    quick: "پنج ویورا اے آئی جواب",
    results: "تلاش کے نتائج",
  },
};
