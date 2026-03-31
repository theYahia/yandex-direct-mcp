#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getCampaignsSchema, handleGetCampaigns } from "./tools/campaigns.js";
import { getAdsSchema, handleGetAds } from "./tools/ads.js";
import { getStatisticsSchema, handleGetStatistics } from "./tools/statistics.js";
import { getKeywordsSchema, handleGetKeywords } from "./tools/keywords.js";

const server = new McpServer({
  name: "yandex-direct-mcp",
  version: "1.0.0",
});

server.tool(
  "get_campaigns",
  "Список рекламных кампаний Яндекс.Директ с бюджетом и статусом.",
  getCampaignsSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleGetCampaigns(params) }],
  }),
);

server.tool(
  "get_ads",
  "Объявления кампании Яндекс.Директ: заголовки, тексты, ссылки.",
  getAdsSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleGetAds(params) }],
  }),
);

server.tool(
  "get_statistics",
  "Статистика кампании: показы, клики, расход, CTR, CPC за период.",
  getStatisticsSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleGetStatistics(params) }],
  }),
);

server.tool(
  "get_keywords",
  "Ключевые слова кампании Яндекс.Директ: фразы, ставки, статусы.",
  getKeywordsSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleGetKeywords(params) }],
  }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[yandex-direct-mcp] Сервер запущен. 4 инструмента. Требуется YANDEX_DIRECT_TOKEN.");
}

main().catch((error) => {
  console.error("[yandex-direct-mcp] Ошибка запуска:", error);
  process.exit(1);
});
