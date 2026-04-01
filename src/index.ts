#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { listCampaignsSchema, handleListCampaigns, getCampaignSchema, handleGetCampaign, createCampaignSchema, handleCreateCampaign, updateCampaignSchema, handleUpdateCampaign } from "./tools/campaigns.js";
import { listAdGroupsSchema, handleListAdGroups, createAdGroupSchema, handleCreateAdGroup } from "./tools/ad_groups.js";
import { listAdsSchema, handleListAds, createTextAdSchema, handleCreateTextAd } from "./tools/ads.js";
import { listKeywordsSchema, handleListKeywords, addKeywordsSchema, handleAddKeywords } from "./tools/keywords.js";
import { getStatisticsSchema, handleGetStatistics } from "./tools/statistics.js";
import { handleGetAccountBalance } from "./tools/account.js";

const server = new McpServer({
  name: "yandex-direct-mcp",
  version: "2.0.0",
});

server.tool(
  "list_campaigns",
  "Список рекламных кампаний Яндекс.Директ с фильтрацией по статусу и типу.",
  listCampaignsSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleListCampaigns(params) }],
  }),
);

server.tool(
  "get_campaign",
  "Детальная информация о кампании по ID: бюджет, статус, даты, статистика.",
  getCampaignSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleGetCampaign(params) }],
  }),
);

server.tool(
  "create_campaign",
  "Создать новую рекламную кампанию в Яндекс.Директ.",
  createCampaignSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleCreateCampaign(params) }],
  }),
);

server.tool(
  "update_campaign",
  "Обновить кампанию: название, бюджет, статус (SUSPEND/RESUME/ARCHIVE).",
  updateCampaignSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleUpdateCampaign(params) }],
  }),
);

server.tool(
  "list_ad_groups",
  "Группы объявлений выбранных кампаний: названия, регионы, статусы.",
  listAdGroupsSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleListAdGroups(params) }],
  }),
);

server.tool(
  "create_ad_group",
  "Создать группу объявлений в кампании с таргетингом по регионам.",
  createAdGroupSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleCreateAdGroup(params) }],
  }),
);

server.tool(
  "list_ads",
  "Объявления в группах: заголовки, тексты, ссылки, статусы.",
  listAdsSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleListAds(params) }],
  }),
);

server.tool(
  "create_text_ad",
  "Создать текстовое объявление: заголовок, текст, ссылка.",
  createTextAdSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleCreateTextAd(params) }],
  }),
);

server.tool(
  "list_keywords",
  "Ключевые слова в группах объявлений: фразы, ставки, статусы.",
  listKeywordsSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleListKeywords(params) }],
  }),
);

server.tool(
  "add_keywords",
  "Добавить ключевые фразы в группу объявлений.",
  addKeywordsSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleAddKeywords(params) }],
  }),
);

server.tool(
  "get_statistics",
  "Статистика кампаний за период: показы, клики, расход, CTR, CPC (ReportService).",
  getStatisticsSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleGetStatistics(params) }],
  }),
);

server.tool(
  "get_account_balance",
  "Информация об аккаунте Яндекс.Директ и состоянии справочников.",
  {},
  async () => ({
    content: [{ type: "text", text: await handleGetAccountBalance() }],
  }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[yandex-direct-mcp] Сервер запущен. 12 инструментов. Требуется YANDEX_DIRECT_TOKEN.");
}

main().catch((error) => {
  console.error("[yandex-direct-mcp] Ошибка запуска:", error);
  process.exit(1);
});
