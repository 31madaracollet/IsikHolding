/**
 * Işık AI istemci yardımcıları.
 *
 * Sohbet, Supabase Edge Function `isik-ai` üzerinden yürür. Groq anahtarı
 * yalnızca sunucuda (Supabase secret) durur; tarayıcıya hiçbir zaman inmez.
 * Burada kullanılan anon key herkese açıktır ve yalnızca fonksiyonun JWT
 * doğrulamasını geçmek için gönderilir.
 */

export type IsikAiRole = "user" | "assistant";

export type IsikAiMessage = {
  role: IsikAiRole;
  content: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const ISIK_AI_ENDPOINT = SUPABASE_URL
  ? `${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/isik-ai`
  : "";

export const ISIK_AI_ENABLED = Boolean(ISIK_AI_ENDPOINT && ANON_KEY);

/** Son 8 mesaj gönderilir; sunucu da aynı sınırı uygular. */
const HISTORY_LIMIT = 8;

export class IsikAiError extends Error {
  readonly status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = "IsikAiError";
    this.status = status;
  }
}

export async function askIsikAi(
  messages: IsikAiMessage[],
  signal?: AbortSignal,
): Promise<string> {
  if (!ISIK_AI_ENABLED) {
    throw new IsikAiError("Işık AI şu an yapılandırılmamış.");
  }

  let response: Response;
  try {
    response = await fetch(ISIK_AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({
        messages: messages
          .filter((message) => message.content.trim().length > 0)
          .slice(-HISTORY_LIMIT),
      }),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new IsikAiError("Bağlantı kurulamadı. İnternetini kontrol edip tekrar dene.");
  }

  const data = (await response.json().catch(() => null)) as
    | { reply?: string; error?: string }
    | null;

  if (!response.ok) {
    throw new IsikAiError(
      data?.error ?? "Işık AI şu an yanıt veremiyor, birazdan tekrar dene.",
      response.status,
    );
  }

  const reply = data?.reply?.trim();
  if (!reply) {
    throw new IsikAiError("Yanıt üretilemedi, tekrar dene.");
  }

  return reply;
}
