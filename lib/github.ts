export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

export interface GitHubStats {
  live: boolean;
  repo: string;
  repoUrl: string;
  stars: number | null;
  forks: number | null;
  openIssues: number | null;
  language: string | null;
  pushedAt: string | null;
  commits: GitHubCommit[];
}

export const GITHUB_REPO =
  process.env.NEXT_PUBLIC_GITHUB_REPO ?? "31madaracollet/IsikHolding";

function headers() {
  const base: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "isik-holding-web",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    base.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return base;
}

export async function getGitHubStats(): Promise<GitHubStats> {
  const repoUrl = `https://github.com/${GITHUB_REPO}`;
  const fallback: GitHubStats = {
    live: false,
    repo: GITHUB_REPO,
    repoUrl,
    stars: null,
    forks: null,
    openIssues: null,
    language: null,
    pushedAt: null,
    commits: [],
  };

  try {
    const [repoResponse, commitsResponse] = await Promise.all([
      fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
        headers: headers(),
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=4`, {
        headers: headers(),
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 3600 },
      }),
    ]);

    if (!repoResponse.ok) return fallback;

    const repo = await repoResponse.json();
    const commitsData = commitsResponse.ok
      ? await commitsResponse.json()
      : [];

    return {
      live: true,
      repo: repo.full_name ?? GITHUB_REPO,
      repoUrl: repo.html_url ?? repoUrl,
      stars: repo.stargazers_count ?? 0,
      forks: repo.forks_count ?? 0,
      openIssues: repo.open_issues_count ?? 0,
      language: repo.language ?? null,
      pushedAt: repo.pushed_at ?? null,
      commits: Array.isArray(commitsData)
        ? commitsData.map(
            (item: {
              sha: string;
              html_url: string;
              commit: {
                message: string;
                author?: { name?: string; date?: string };
              };
            }) => ({
              sha: item.sha?.slice(0, 7) ?? "",
              message: item.commit?.message?.split("\n")[0] ?? "Commit",
              author: item.commit?.author?.name ?? "Işık Holding",
              date: item.commit?.author?.date ?? new Date().toISOString(),
              url: item.html_url,
            }),
          )
        : [],
    };
  } catch {
    return fallback;
  }
}
