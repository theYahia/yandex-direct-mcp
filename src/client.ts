const BASE_URL = "https://api.direct.yandex.com/json/v5/";
const REPORT_URL = "https://api.direct.yandex.com/json/v5/reports";
const TIMEOUT = 15_000;
const MAX_RETRIES = 3;

function getToken(): string {
  const token = process.env.YANDEX_DIRECT_TOKEN;
  if (!token) {
    throw new Error("Переменная окружения YANDEX_DIRECT_TOKEN не задана");
  }
  return token;
}

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = MAX_RETRIES): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);

      if (response.ok) return response;

      if (response.status >= 500 && attempt < retries) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        console.error(`[yandex-direct-mcp] ${response.status} от ${url}, повтор через ${delay}мс (${attempt}/${retries})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      const body = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status}: ${response.statusText}. ${body}`);
    } catch (error) {
      clearTimeout(timer);
      if (attempt === retries) throw error;
      if (error instanceof DOMException && error.name === "AbortError") {
        console.error(`[yandex-direct-mcp] Таймаут ${url}, повтор (${attempt}/${retries})`);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Все попытки исчерпаны");
}

export async function apiPost(service: string, method: string, params: Record<string, unknown> = {}): Promise<unknown> {
  const url = `${BASE_URL}${service}`;
  const response = await fetchWithRetry(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      "Accept-Language": "ru",
    },
    body: JSON.stringify({ method, params }),
  });
  return response.json();
}

export async function apiReport(params: Record<string, unknown>): Promise<string> {
  const response = await fetchWithRetry(REPORT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      "Accept-Language": "ru",
      processingMode: "auto",
      returnMoneyInMicros: "false",
    },
    body: JSON.stringify({ params }),
  });
  return response.text();
}
