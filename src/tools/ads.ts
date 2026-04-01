import { z } from "zod";
import { apiPost } from "../client.js";

export const listAdsSchema = z.object({
  ad_group_ids: z.array(z.number()).describe("ID групп объявлений"),
});

export async function handleListAds(params: z.infer<typeof listAdsSchema>): Promise<string> {
  const data = await apiPost("ads", "get", {
    SelectionCriteria: { AdGroupIds: params.ad_group_ids },
    FieldNames: ["Id", "CampaignId", "AdGroupId", "State", "Status"],
    TextAdFieldNames: ["Title", "Title2", "Text", "Href", "DisplayDomain"],
  });
  return JSON.stringify(data, null, 2);
}

export const createTextAdSchema = z.object({
  ad_group_id: z.number().describe("ID группы объявлений"),
  title: z.string().describe("Заголовок (до 35 символов)"),
  title2: z.string().optional().describe("Второй заголовок (до 30 символов)"),
  text: z.string().describe("Текст объявления (до 81 символа)"),
  href: z.string().describe("Ссылка на сайт"),
});

export async function handleCreateTextAd(params: z.infer<typeof createTextAdSchema>): Promise<string> {
  const textAd: Record<string, unknown> = {
    Title: params.title,
    Text: params.text,
    Href: params.href,
  };
  if (params.title2) textAd.Title2 = params.title2;

  const data = await apiPost("ads", "add", {
    Ads: [{
      AdGroupId: params.ad_group_id,
      TextAd: textAd,
    }],
  });
  return JSON.stringify(data, null, 2);
}
