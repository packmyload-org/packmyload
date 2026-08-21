import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { areas } from "@/lib/areas-data";

const BASE_URL = "https://www.packmyload.com";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/moving-company-lagos", changefreq: "monthly", priority: "0.9" },
  { path: "/best-moving-company-near-me", changefreq: "monthly", priority: "0.9" },
  { path: "/moving-company-nigeria", changefreq: "monthly", priority: "0.9" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/book", changefreq: "monthly", priority: "0.9" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/hub", changefreq: "monthly", priority: "0.7" },
  { path: "/artisans", changefreq: "weekly", priority: "0.7" },
  { path: "/partner", changefreq: "monthly", priority: "0.6" },
  { path: "/gallery", changefreq: "monthly", priority: "0.6" },
  { path: "/Faqs", changefreq: "monthly", priority: "0.6" },
  { path: "/home-moves", changefreq: "monthly", priority: "0.8" },
  { path: "/office-moves", changefreq: "monthly", priority: "0.8" },
  { path: "/store-delivery", changefreq: "monthly", priority: "0.7" },
  { path: "/Interstate-Car-Transport", changefreq: "monthly", priority: "0.7" },
  { path: "/Junk-moves", changefreq: "monthly", priority: "0.7" },
  { path: "/wedding-handling", changefreq: "monthly", priority: "0.7" },
  { path: "/international-relocations", changefreq: "monthly", priority: "0.7" },
  { path: "/cleaning", changefreq: "monthly", priority: "0.7" },
  { path: "/storage", changefreq: "monthly", priority: "0.7" },
  { path: "/movers", changefreq: "monthly", priority: "0.8" },
  ...areas.map((area) => ({
    path: `/movers/${area.slug}`,
    changefreq: "monthly" as const,
    priority: "0.8",
  })),
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
