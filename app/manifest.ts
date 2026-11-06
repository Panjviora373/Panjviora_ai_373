import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PANJVIORA AI 373",
    short_name: "PANJVIORA",
    description: "Your AI-powered search and discovery platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7138e8",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
