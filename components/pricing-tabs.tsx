"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Check, Home, Sparkles } from "lucide-react";
import { subscriptionPlans, wholesalePlans, type Plan } from "@/lib/pricing";
import { cn } from "@/lib/utils";

function PlanCard({
  plan,
  yearly,
  isWholesale,
}: {
  plan: Plan;
  yearly: boolean;
  isWholesale: boolean;
}) {
  const price = yearly ? plan.yearly : plan.monthly;
  const period = yearly ? "/ yıl" : isWholesale ? "" : "/ ay";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-[28px] border p-6 transition duration-300 hover:-translate-y-1",
        plan.highlight
          ? "border-ink bg-ink text-white shadow-glow"
          : "border-ink/[0.08] bg-white text-ink hover:shadow-card",
      )}
    >
      {plan.badge && (
        <span
          className={cn(
            "absolute -top-3 left-6 rounded-full px-3 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em]",
            plan.highlight ? "bg-brand text-ink" : "bg-brand-100 text-ink",
          )}
        >
          {plan.badge}
        </span>
      )}

      <h3
        className={cn(
          "mt-1 font-display text-[19px] font-semibold",
          plan.highlight && "text-white",
        )}
      >
        {plan.name}
      </h3>
      <p
        className={cn(
          "mt-1.5 min-h-[42px] text-[12px] leading-relaxed",
          plan.highlight ? "text-white/55" : "text-ink/50",
        )}
      >
        {plan.tagline}
      </p>

      <div className="mt-5 flex items-end gap-1.5">
        {price > 0 ? (
          <>
            <span className="font-display text-[34px] font-bold leading-none tracking-tight">
              {new Intl.NumberFormat("tr-TR").format(price)}
            </span>
            <span
              className={cn(
                "pb-1 text-[11px] font-semibold",
                plan.highlight ? "text-white/50" : "text-ink/40",
              )}
            >
              {isWholesale ? "TL · " : "TL "}
              {plan.unit ?? period}
            </span>
          </>
        ) : (
          <span className="font-display text-[30px] font-bold leading-none">
            Teklife özel
          </span>
        )}
      </div>
      {!isWholesale && yearly && price > 0 && (
        <p
          className={cn(
            "mt-1.5 text-[10.5px] font-semibold",
            plan.highlight ? "text-brand-300" : "text-emerald-700",
          )}
        >
          2 ay hediye · aylık {new Intl.NumberFormat("tr-TR").format(Math.round(plan.yearly / 12))} TL
        </p>
      )}

      <ul className="mt-6 flex-1 space-y-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-[12px] leading-relaxed">
            <span
              className={cn(
                "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                plan.highlight ? "bg-brand text-ink" : "bg-brand-100 text-ink",
              )}
            >
              <Check className="size-2.5" strokeWidth={3} />
            </span>
            <span className={plan.highlight ? "text-white/75" : "text-ink/60"}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={plan.href}
        className={cn(
          "mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[12.5px] font-bold transition",
          plan.highlight
            ? "bg-brand text-ink hover:bg-brand-300"
            : "border border-ink/12 bg-white hover:border-ink hover:bg-ink hover:text-white",
        )}
      >
        {plan.cta}
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

export function PricingTabs() {
  const [segment, setSegment] = useState<"individual" | "business">("individual");
  const [yearly, setYearly] = useState(false);

  const plans = segment === "individual" ? subscriptionPlans : wholesalePlans;

  return (
    <div>
      <div className="flex flex-col items-center gap-5">
        <div className="inline-flex rounded-full border border-ink/10 bg-white p-1">
          <button
            type="button"
            onClick={() => setSegment("individual")}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-bold transition",
              segment === "individual" ? "bg-ink text-white" : "text-ink/55",
            )}
          >
            <Home className="size-3.5" />
            Bireysel & aile
          </button>
          <button
            type="button"
            onClick={() => setSegment("business")}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-bold transition",
              segment === "business" ? "bg-ink text-white" : "text-ink/55",
            )}
          >
            <Building2 className="size-3.5" />
            Toptan & bayi
          </button>
        </div>

        {segment === "individual" ? (
          <div className="flex items-center gap-3 text-[12px]">
            <span className={cn("font-semibold", !yearly ? "text-ink" : "text-ink/45")}>
              Aylık
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={yearly}
              aria-label="Yıllık ödemeye geç"
              onClick={() => setYearly((value) => !value)}
              className={cn(
                "relative h-7 w-12 rounded-full transition",
                yearly ? "bg-ink" : "bg-ink/15",
              )}
            >
              <span
                className={cn(
                  "absolute top-1 size-5 rounded-full bg-brand transition-all",
                  yearly ? "left-6" : "left-1",
                )}
              />
            </button>
            <span className={cn("font-semibold", yearly ? "text-ink" : "text-ink/45")}>
              Yıllık
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-bold text-ink">
              <Sparkles className="size-3" />
              2 ay hediye
            </span>
          </div>
        ) : (
          <p className="max-w-xl text-center text-[12px] leading-relaxed text-ink/45">
            Bayi fiyatları yıllık alım taahhüdüne göre uygulanır. Tüm paketlerde
            ürün eğitimi, teknik dokümantasyon ve iade garantisi standarttır.
          </p>
        )}
      </div>

      <div className="mt-9 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            yearly={yearly}
            isWholesale={segment === "business"}
          />
        ))}
      </div>
    </div>
  );
}
