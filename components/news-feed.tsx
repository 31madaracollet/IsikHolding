"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { NewsCard } from "@/components/news-card";
import type { NewsCategory, NewsItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const categories: (NewsCategory | "Tümü")[] = [
  "Tümü",
  "Enerji",
  "Teknoloji",
  "Sektör",
  "Ekonomi",
];

export function NewsFeed({ items }: { items: NewsItem[] }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("Tümü");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(7);

  const filtered = useMemo(() => {
    const normalized = query.toLocaleLowerCase("tr-TR").trim();
    return items.filter((item) => {
      const matchesCategory =
        category === "Tümü" || item.category === category;
      const matchesQuery =
        !normalized ||
        `${item.title} ${item.excerpt} ${item.source}`
          .toLocaleLowerCase("tr-TR")
          .includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [items, category, query]);

  const shown = filtered.slice(0, visible);
  const [lead, ...rest] = shown;

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl border border-ink/[0.07] bg-white p-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setCategory(item);
                setVisible(7);
              }}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-[11.5px] font-bold transition",
                category === item ? "bg-ink text-white" : "text-ink/55 hover:bg-ink/5",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/35" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisible(7);
            }}
            type="search"
            placeholder="Haberlerde ara…"
            aria-label="Haberlerde ara"
            className="w-full rounded-full border border-ink/10 bg-cream py-2.5 pl-9 pr-9 text-[12px] outline-none transition placeholder:text-ink/35 focus:border-brand-500 focus:ring-4 focus:ring-brand/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Aramayı temizle"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-ink/15 bg-white p-12 text-center">
          <p className="font-display text-xl font-semibold">Haber bulunamadı</p>
          <p className="mt-2 text-sm text-ink/50">
            Arama kriterlerinizi değiştirerek tekrar deneyin.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-5">
            {lead && <NewsCard item={lead} featured />}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {visible < filtered.length && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((value) => value + 6)}
                className="rounded-full border border-ink/12 bg-white px-6 py-3 text-[12.5px] font-bold transition hover:border-ink/30 hover:bg-ink hover:text-white"
              >
                Daha fazla haber yükle ({filtered.length - visible})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
