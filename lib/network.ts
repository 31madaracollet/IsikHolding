/**
 * Supabase istemcisi, ağ katmanı nedeniyle bağlantı kuramadığında dönen
 * hataları ayırt eder. Bu durumda route handler, tarayıcı köprüsünü
 * işaret eden bir yanıt döndürür.
 */
export function isNetworkError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? `${error.name}: ${error.message}`
      : typeof error === "string"
        ? error
        : JSON.stringify(error ?? {});

  return /fetch failed|ECONNRESET|ENOTFOUND|ETIMEDOUT|EAI_AGAIN|socket hang up|network|abort/i.test(
    message,
  );
}

export function fallbackResponse(message: string) {
  return {
    ok: false as const,
    fallback: true as const,
    error: message,
  };
}
