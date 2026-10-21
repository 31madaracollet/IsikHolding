import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  action?: { label: string; href: string };
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-[640px]", align === "center" && "mx-auto")}>
        {eyebrow && (
          <span className="eyebrow">
            <span className="size-1.5 rounded-full bg-brand-500" />
            {eyebrow}
          </span>
        )}
        <h2 className="mt-3 font-display text-[30px] font-semibold leading-[1.1] sm:text-[38px] lg:text-[42px]">
          {title}
        </h2>
        {description && (
          <p className="mt-3.5 text-[14px] leading-relaxed text-ink/55 sm:text-[15px]">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-ink/12 bg-white px-5 py-3 text-[12.5px] font-bold transition hover:border-ink/30 hover:bg-ink hover:text-white"
        >
          {action.label}
          <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
