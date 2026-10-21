import { cn } from "@/lib/utils";

export function LogoMark({
  className,
  withGlow = false,
}: {
  className?: string;
  withGlow?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-brand text-ink",
        withGlow && "shadow-[0_10px_30px_-10px_rgba(245,184,0,0.9)]",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2.75a6.25 6.25 0 0 0-3.9 11.13c.58.45.93 1.1 1.04 1.79l.1.66h5.52l.1-.66c.11-.7.46-1.34 1.04-1.79A6.25 6.25 0 0 0 12 2.75Z"
          fill="currentColor"
          stroke="#121212"
          strokeWidth="1.1"
        />
        <path
          d="M9.4 18.35h5.2M10.1 21h3.8"
          stroke="#121212"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M12 6.4v4.2m-2.1-2.1L12 6.4l2.1 2.1"
          stroke="#FFFCF4"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[19px] font-bold tracking-tight",
            tone === "dark" ? "text-white" : "text-ink",
          )}
        >
          Işık<span className="text-brand-500">Holding</span>
        </span>
        <span
          className={cn(
            "mt-1 text-[9px] font-bold uppercase tracking-[0.3em]",
            tone === "dark" ? "text-white/45" : "text-ink/40",
          )}
        >
          Lighting Group
        </span>
      </span>
    </span>
  );
}
