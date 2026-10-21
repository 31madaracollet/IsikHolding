import { ArrowUpRight, Zap } from "lucide-react";
import type { NewsItem } from "@/lib/types";

export function NewsTicker({ items }: { items: NewsItem[] }) {
  const tickerItems = [...items.slice(0, 6), ...items.slice(0, 6)];

  return (
    <div className="relative flex items-center overflow-hidden rounded-2xl bg-ink text-white">
      <div className="relative z-10 flex shrink-0 items-center gap-2 self-stretch bg-brand px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
        <Zap className="size-3.5" />
        <span className="whitespace-nowrap">Işık Gündem</span>
        <span className="absolute -right-2 top-0 h-full w-4 bg-brand [clip-path:polygon(0_0,100%_50%,0_100%)]" />
      </div>
      <div className="group relative flex-1 overflow-hidden py-3">
        <div className="flex w-max animate-ticker items-center gap-8 pl-6 group-hover:[animation-play-state:paused]">
          {tickerItems.map((item, index) => (
            <a
              key={`${item.id}-${index}`}
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex shrink-0 items-center gap-2 text-[11.5px] text-white/65 transition hover:text-brand-300"
            >
              <span className="size-1 rounded-full bg-brand/70" />
              <span className="max-w-[420px] truncate">{item.title}</span>
              <ArrowUpRight className="size-3 text-white/30" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
