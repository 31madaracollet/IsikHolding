import {
  ArrowUpRight,
  CircleDot,
  GitCommitHorizontal,
  GitFork,
  Star,
} from "lucide-react";
import { GithubIcon } from "@/components/brand-icons";
import { getGitHubStats } from "@/lib/github";
import { formatDate } from "@/lib/utils";

export async function GitHubCard() {
  const stats = await getGitHubStats();

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-ink p-6 text-white sm:p-8">
      <div
        className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #FFC800, transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-white/10">
              <GithubIcon className="size-5" />
            </span>
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-brand-300">
                Açık kaynak
              </p>
              <a
                href={stats.repoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="font-display text-[17px] font-semibold hover:text-brand-300"
              >
                {stats.repo}
              </a>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1 text-[9.5px] font-semibold text-white/55">
            <span
              className={`size-1.5 rounded-full ${stats.live ? "bg-emerald-400" : "bg-brand"}`}
            />
            {stats.live ? "GitHub API bağlı" : "GitHub deposu"}
          </span>
        </div>

        <p className="mt-4 max-w-lg text-[12px] leading-relaxed text-white/45">
          Bu sitenin kaynak kodu GitHub üzerinde geliştirilir. Veri katmanı
          Supabase, arayüz Next.js ile çalışır; sürüm geçmişi herkese açıktır.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { icon: Star, label: "Yıldız", value: stats.stars },
            { icon: GitFork, label: "Çatal", value: stats.forks },
            { icon: CircleDot, label: "Açık konu", value: stats.openIssues },
          ].map((metric) => (
            <div key={metric.label} className="rounded-2xl bg-white/[0.05] p-3">
              <metric.icon className="size-3.5 text-brand-300" />
              <p className="mt-2 font-display text-xl font-semibold">
                {metric.value ?? "—"}
              </p>
              <p className="text-[9px] uppercase tracking-wider text-white/35">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <p className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-white/35">
            <GitCommitHorizontal className="size-3.5" />
            Son commit&apos;ler
          </p>
          {stats.commits.length > 0 ? (
            <ul className="mt-2 divide-y divide-white/[0.07]">
              {stats.commits.map((commit) => (
                <li key={commit.sha}>
                  <a
                    href={commit.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center justify-between gap-3 py-2 text-[11px] transition hover:text-brand-300"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <code className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-brand-300">
                        {commit.sha}
                      </code>
                      <span className="truncate text-white/60">{commit.message}</span>
                    </span>
                    <span className="shrink-0 text-[9.5px] text-white/30">
                      {formatDate(commit.date)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 rounded-xl bg-white/[0.04] p-3 text-[11px] leading-relaxed text-white/35">
              Commit akışı, GitHub token&apos;ı tanımlandığında burada canlı olarak
              listelenir. Depoyu doğrudan GitHub üzerinden inceleyebilirsiniz.
            </p>
          )}
        </div>

        <a
          href={stats.repoUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-[11px] font-bold text-ink transition hover:bg-brand-300"
        >
          GitHub&apos;da incele <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </div>
  );
}
