import { z } from "zod";
import { apiPost } from "../client.js";

export const listAdGroupsSchema = z.object({
  campaign_ids: z.array(z.number()).describe("ID кампаний для выборки групп"),
});

export async function handleListAdGroups(params: z.infer<typeof listAdGroupsSchema>): Promise<string> {
  const data = await apiPost("adgroups", "get", {
    SelectionCriteria: { CampaignIds: params.campaign_ids },
    FieldNames: ["Id", "Name", "CampaignId", "RegionIds", "Status", "Type"],
  });
  return JSON.stringify(data, null, 2);
}

export const createAdGroupSchema = z.object({
  campaign_id: z.number().describe("ID кампании"),
  name: z.string().describe("Название группы объявлений"),
  region_ids: z.array(z.number()).describe("Коды регионов показа (например [225] = Россия)"),
});

export async function handleCreateAdGroup(params: z.infer<typeof createAdGroupSchema>): Promise<string> {
  const data = await apiPost("adgroups", "add", {
    AdGroups: [{
      Name: params.name,
      CampaignId: params.campaign_id,
      RegionIds: params.region_ids,
    }],
  });
  return JSON.stringify(data, null, 2);
}
