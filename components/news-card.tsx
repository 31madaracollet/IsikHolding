import { ArrowUpRight, Clock, Radio } from "lucide-react";
import type { NewsItem } from "@/lib/types";
import { cn, timeAgo } from "@/lib/utils";

const categoryStyles: Record<string, string> = {
  Enerji: "bg-brand text-ink",
  Teknoloji: "bg-ink text-brand-300",
  Sektör: "bg-ink/[0.06] text-ink/70",
  Ekonomi: "bg-white text-ink/70 border border-ink/10",
};

export function NewsCard({
  item,
  featured = false,
}: {
  item: NewsItem;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-ink/[0.07] bg-white transition duration-500 hover:border-ink/15 hover:shadow-card",
        featured && "lg:flex-row",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-sand",
          featured ? "aspect-[16/10] lg:aspect-auto lg:w-[46%]" : "aspect-[16/9]",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image ?? "/images/product-led.jpg"}
          alt=""
          loading="lazy"
          className="size-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wider backdrop-blur",
              categoryStyles[item.category] ?? "bg-white text-ink",
            )}
          >
            {item.category}
          </span>
          {item.live && (
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700 backdrop-blur">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              Canlı
            </span>
          )}
        </div>
      </div>

      <div className={cn("flex flex-1 flex-col p-5", featured && "lg:p-7")}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-medium text-ink/40">
          <span className="font-bold uppercase tracking-wider text-ink/60">
            {item.source}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {timeAgo(item.publishedAt)}
          </span>
          {item.live && <Radio className="size-3 text-emerald-600" />}
        </div>

        <h3
          className={cn(
            "mt-2.5 font-display font-semibold leading-[1.22] transition group-hover:text-ink/75",
            featured ? "text-[22px] sm:text-[26px]" : "text-[17px]",
          )}
        >
          {item.title}
        </h3>
        <p
          className={cn(
            "mt-2 text-ink/50",
            featured
              ? "line-clamp-3 text-[13px] leading-relaxed"
              : "line-clamp-2 text-[12px] leading-relaxed",
          )}
        >
          {item.excerpt}
        </p>

        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[11.5px] font-bold text-ink transition hover:text-brand-600"
        >
          Kaynağında oku
          <ArrowUpRight className="size-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </article>
  );
}
