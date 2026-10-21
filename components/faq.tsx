import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Faq({
  items,
  className,
}: {
  items: { question: string; answer: string }[];
  className?: string;
}) {
  return (
    <div className={cn("divide-y divide-ink/[0.08] border-y border-ink/[0.08]", className)}>
      {items.map((item, index) => (
        <details key={item.question} className="group py-1" open={index === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
            <span className="font-display text-[16px] font-semibold leading-snug sm:text-[17px]">
              {item.question}
            </span>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-ink/12 bg-white transition group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-brand">
              <Plus className="size-4" />
            </span>
          </summary>
          <p className="max-w-[85%] pb-6 text-[13px] leading-relaxed text-ink/55">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
