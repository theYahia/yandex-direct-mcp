import { z } from "zod";
import { apiPost } from "../client.js";

export const listCampaignsSchema = z.object({
  status: z.string().optional().describe("Фильтр по статусу: ACCEPTED, DRAFT, MODERATION, etc."),
  types: z.array(z.string()).optional().describe("Типы кампаний: TEXT_CAMPAIGN, DYNAMIC_TEXT_CAMPAIGN, etc."),
});

export async function handleListCampaigns(params: z.infer<typeof listCampaignsSchema>): Promise<string> {
  const selectionCriteria: Record<string, unknown> = {};
  if (params.status) {
    selectionCriteria.Statuses = [params.status];
  }
  if (params.types) {
    selectionCriteria.Types = params.types;
  }

  const data = await apiPost("campaigns", "get", {
    SelectionCriteria: selectionCriteria,
    FieldNames: ["Id", "Name", "Status", "State", "DailyBudget", "StartDate", "Type", "Statistics"],
  });
  return JSON.stringify(data, null, 2);
}

export const getCampaignSchema = z.object({
  campaign_id: z.number().describe("ID рекламной кампании"),
});

export async function handleGetCampaign(params: z.infer<typeof getCampaignSchema>): Promise<string> {
  const data = await apiPost("campaigns", "get", {
    SelectionCriteria: { Ids: [params.campaign_id] },
    FieldNames: ["Id", "Name", "Status", "State", "DailyBudget", "StartDate", "EndDate", "Type", "Statistics"],
  });
  return JSON.stringify(data, null, 2);
}

export const createCampaignSchema = z.object({
  name: z.string().describe("Название кампании"),
  type: z.string().default("TEXT_CAMPAIGN").describe("Тип: TEXT_CAMPAIGN, DYNAMIC_TEXT_CAMPAIGN"),
  start_date: z.string().describe("Дата начала YYYY-MM-DD"),
  daily_budget: z.number().optional().describe("Дневной бюджет в у.е. (микро-единицы)"),
});

export async function handleCreateCampaign(params: z.infer<typeof createCampaignSchema>): Promise<string> {
  const campaign: Record<string, unknown> = {
    Name: params.name,
    StartDate: params.start_date,
  };
  if (params.daily_budget) {
    campaign.DailyBudget = { Amount: params.daily_budget, Mode: "STANDARD" };
  }

  // Build type-specific settings
  if (params.type === "TEXT_CAMPAIGN") {
    campaign.TextCampaign = {
      BiddingStrategy: {
        Search: { BiddingStrategyType: "HIGHEST_POSITION" },
        Network: { BiddingStrategyType: "SERVING_OFF" },
      },
    };
  } else if (params.type === "DYNAMIC_TEXT_CAMPAIGN") {
    campaign.DynamicTextCampaign = {
      BiddingStrategy: {
        Search: { BiddingStrategyType: "HIGHEST_POSITION" },
        Network: { BiddingStrategyType: "SERVING_OFF" },
      },
    };
  }

  const data = await apiPost("campaigns", "add", {
    Campaigns: [campaign],
  });
  return JSON.stringify(data, null, 2);
}

export const updateCampaignSchema = z.object({
  campaign_id: z.number().describe("ID кампании"),
  name: z.string().optional().describe("Новое название"),
  daily_budget: z.number().optional().describe("Новый дневной бюджет"),
  status: z.string().optional().describe("Действие: SUSPEND, RESUME, ARCHIVE, UNARCHIVE"),
});

export async function handleUpdateCampaign(params: z.infer<typeof updateCampaignSchema>): Promise<string> {
  // Handle status actions separately
  if (params.status) {
    const actionMap: Record<string, string> = {
      SUSPEND: "suspend",
      RESUME: "resume",
      ARCHIVE: "archive",
      UNARCHIVE: "unarchive",
    };
    const method = actionMap[params.status];
    if (method) {
      const data = await apiPost("campaigns", method, {
        SelectionCriteria: { Ids: [params.campaign_id] },
      });
      return JSON.stringify(data, null, 2);
    }
  }

  const campaign: Record<string, unknown> = { Id: params.campaign_id };
  if (params.name) campaign.Name = params.name;
  if (params.daily_budget) {
    campaign.DailyBudget = { Amount: params.daily_budget, Mode: "STANDARD" };
  }

  const data = await apiPost("campaigns", "update", {
    Campaigns: [campaign],
  });
  return JSON.stringify(data, null, 2);
}
