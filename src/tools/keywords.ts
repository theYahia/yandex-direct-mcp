import { z } from "zod";
import { apiPost } from "../client.js";

export const getKeywordsSchema = z.object({
  campaign_id: z.number().describe("ID рекламной кампании"),
});

export async function handleGetKeywords(params: z.infer<typeof getKeywordsSchema>): Promise<string> {
  const data = await apiPost("keywords", "get", {
    SelectionCriteria: { CampaignIds: [params.campaign_id] },
    FieldNames: ["Id", "Keyword", "CampaignId", "AdGroupId", "Status", "State", "Bid"],
  });
  return JSON.stringify(data, null, 2);
}
