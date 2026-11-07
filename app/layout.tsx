
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ALIQO - Smart Search Engine",
    template: "%s | ALIQO",
  },
  description:
    "Discover information, explore websites, and find answers with ALIQO, your smarter search experience.",
  applicationName: "ALIQO",
  keywords: [
    "ALIQO",
    "ALIQO Search",
    "Search Engine",
    "AI Search",
    "Web Search",
    "Online Search",
  ],
  authors: [{ name: "ALIQO" }],
  creator: "ALIQO",
  publisher: "ALIQO",
  openGraph: {
    title: "ALIQO - Smart Search Engine",
    description:
      "Discover the world with ALIQO. Search the web and explore information.",
    siteName: "ALIQO",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ALIQO - Smart Search Engine",
    description:
      "Discover information and explore the web with ALIQO.",
  },
  verification: {
    google: "7zfDw38nwUHBoxZTRYLaXApi6kMWQKG8S8EqX7MVmFI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2101414354041917"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}

