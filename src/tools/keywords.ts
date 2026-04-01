import { z } from "zod";
import { apiPost } from "../client.js";

export const listKeywordsSchema = z.object({
  ad_group_ids: z.array(z.number()).describe("ID групп объявлений"),
});

export async function handleListKeywords(params: z.infer<typeof listKeywordsSchema>): Promise<string> {
  const data = await apiPost("keywords", "get", {
    SelectionCriteria: { AdGroupIds: params.ad_group_ids },
    FieldNames: ["Id", "Keyword", "CampaignId", "AdGroupId", "Status", "State", "Bid"],
  });
  return JSON.stringify(data, null, 2);
}

export const addKeywordsSchema = z.object({
  ad_group_id: z.number().describe("ID группы объявлений"),
  keywords: z.array(z.string()).describe("Массив ключевых фраз"),
});

export async function handleAddKeywords(params: z.infer<typeof addKeywordsSchema>): Promise<string> {
  const data = await apiPost("keywords", "add", {
    Keywords: params.keywords.map(kw => ({
      AdGroupId: params.ad_group_id,
      Keyword: kw,
    })),
  });
  return JSON.stringify(data, null, 2);
}
