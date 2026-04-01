import { apiPost } from "../client.js";

export async function handleGetAccountBalance(): Promise<string> {
  const data = await apiPost("changes", "checkDictionaries", {});
  // Account balance is available via the Accounts service
  const balanceData = await apiPost("agencyclients", "get", {
    SelectionCriteria: {},
    FieldNames: ["Login", "AccountQuality"],
  }).catch(() => null);

  // Fallback: use the simpler endpoint
  const result: Record<string, unknown> = { dictionaries: data };
  if (balanceData) {
    result.accounts = balanceData;
  }
  return JSON.stringify(result, null, 2);
}
