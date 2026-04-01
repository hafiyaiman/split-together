import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SplitTogether",
    short_name: "SplitTogether",
    description:
      "Split bills, calculate balances, and share the cleanest payment plan.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fafafa",
    theme_color: "#fafafa",
    icons: [
      {
        src: "/logo/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/logo/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
