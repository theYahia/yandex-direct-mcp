import { z } from "zod";
import { apiPost } from "../client.js";

export const getAdsSchema = z.object({
  campaign_id: z.number().describe("ID рекламной кампании"),
});

export async function handleGetAds(params: z.infer<typeof getAdsSchema>): Promise<string> {
  const data = await apiPost("ads", "get", {
    SelectionCriteria: { CampaignIds: [params.campaign_id] },
    FieldNames: ["Id", "CampaignId", "State", "Status"],
    TextAdFieldNames: ["Title", "Title2", "Text", "Href", "DisplayDomain"],
  });
  return JSON.stringify(data, null, 2);
}
