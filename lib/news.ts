import { fallbackNews, companyUpdates } from "@/lib/news-data";
import type { NewsCategory, NewsItem } from "@/lib/types";

const RSS_SOURCES: {
  name: string;
  url: string;
  category: NewsCategory;
}[] = [
  {
    name: "Webrazzi",
    url: "https://webrazzi.com/feed/",
    category: "Teknoloji",
  },
  {
    name: "Enerji Günlüğü",
    url: "https://www.enerjigunlugu.net/rss/",
    category: "Enerji",
  },
  {
    name: "Donanım Haber",
    url: "https://www.donanimhaber.com/rss/tum/",
    category: "Teknoloji",
  },
  {
    name: "Anadolu Ajansı",
    url: "https://www.aa.com.tr/tr/rss/default?cat=ekonomi",
    category: "Ekonomi",
  },
];

const IMAGE_BY_CATEGORY: Record<NewsCategory, string> = {
  Enerji: "/images/product-solar.jpg",
  Teknoloji: "/images/product-smart.jpg",
  Sektör: "/images/about-warehouse.jpg",
  Ekonomi: "/images/product-panel.jpg",
};

function decodeEntities(value: string) {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&hellip;": "…",
    "&mdash;": "—",
    "&ndash;": "–",
  };
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(parseInt(code, 16)),
    )
    .replace(/&[a-z]+;|&#\d+;/gi, (entity) => entities[entity] ?? " ");
}

function stripHtml(value: string) {
  return decodeEntities(
    value
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  ).trim();
}

function readTag(chunk: string, tag: string) {
  const match = chunk.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"),
  );
  return match ? stripHtml(match[1]) : "";
}

function guessCategory(title: string, fallback: NewsCategory): NewsCategory {
  const value = title.toLocaleLowerCase("tr-TR");
  if (/(güneş|enerji|elektrik|led|aydınlatma|şarj|batarya)/.test(value)) {
    return "Enerji";
  }
  if (/(akıllı|yapay zeka|teknoloji|wifi|wi-fi|matter|sensör|oled|yazılım)/.test(value)) {
    return "Teknoloji";
  }
  if (/(fiyat|tarife|ithalat|ihracat|ekonomi|maliyet|yatırım|enflasyon)/.test(value)) {
    return "Ekonomi";
  }
  return fallback;
}

function parseFeed(xml: string, source: string, category: NewsCategory) {
  const items = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].slice(0, 8);
  return items.flatMap<NewsItem>((match, index) => {
    const chunk = match[0];
    const title = readTag(chunk, "title");
    const link = readTag(chunk, "link");
    if (!title || !link) return [];
    const description = readTag(chunk, "description");
    const pubDate = readTag(chunk, "pubDate");
    const publishedAt = pubDate && !Number.isNaN(Date.parse(pubDate))
      ? new Date(pubDate).toISOString()
      : new Date().toISOString();
    const resolvedCategory = guessCategory(title, category);
    return [
      {
        id: `${source.toLocaleLowerCase("tr-TR").replace(/\s+/g, "-")}-${index}-${publishedAt}`,
        title,
        excerpt: description
          ? description.slice(0, 190) + (description.length > 190 ? "…" : "")
          : "Haberi kaynağında okumak için başlığa dokunun.",
        source,
        sourceUrl: link,
        publishedAt,
        category: resolvedCategory,
        image: IMAGE_BY_CATEGORY[resolvedCategory],
        live: true,
      },
    ];
  });
}

async function fetchSource(source: (typeof RSS_SOURCES)[number]) {
  const response = await fetch(source.url, {
    headers: {
      "User-Agent": "IsikHoldingNewsBot/1.0 (+https://isikholding.com)",
      Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
    },
    signal: AbortSignal.timeout(3500),
    next: { revalidate: 900 },
  });
  if (!response.ok) throw new Error(`${source.name}: ${response.status}`);
  const xml = await response.text();
  return parseFeed(xml, source.name, source.category);
}

export async function getNews(): Promise<{
  items: NewsItem[];
  live: boolean;
}> {
  try {
    const results = await Promise.allSettled(RSS_SOURCES.map(fetchSource));
    const fetched = results
      .filter(
        (result): result is PromiseFulfilledResult<NewsItem[]> =>
          result.status === "fulfilled",
      )
      .flatMap((result) => result.value);

    const seen = new Set<string>();
    const unique = fetched
      .filter((item) => {
        const key = item.title.toLocaleLowerCase("tr-TR");
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
      .slice(0, 18);

    if (unique.length >= 4) {
      return { items: unique, live: true };
    }
  } catch {
    // RSS erişimi yoksa demo akışa düşeriz.
  }

  return { items: fallbackNews, live: false };
}

export { companyUpdates };

export function getNewsCategories(items: NewsItem[]): NewsCategory[] {
  return Array.from(new Set(items.map((item) => item.category)));
}
