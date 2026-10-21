"use client";

import { useEffect, useState } from "react";

const planNames: Record<string, string> = {
  mini: "Mini",
  smart: "Smart",
  pro: "Home Pro",
};

/** `?plan=` parametresi varsa iletişim sayfasında küçük bir bilgi şeridi gösterir. */
export function PlanNote() {
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("plan");
    if (requested && planNames[requested]) setPlan(planNames[requested]);
  }, []);

  if (!plan) return null;

  return (
    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand/20 px-4 py-2 text-[11px] font-semibold">
      <span className="flex size-4 items-center justify-center rounded-full bg-ink text-[8px] text-brand">
        1
      </span>
      İlgilendiğiniz plan: <strong>{plan}</strong> · formun konusu otomatik
      seçildi.
    </div>
  );
}
