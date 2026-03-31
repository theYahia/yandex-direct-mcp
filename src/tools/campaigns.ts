import { z } from "zod";
import { apiPost } from "../client.js";

export const getCampaignsSchema = z.object({
  status: z.string().optional().describe("Фильтр по статусу: ACCEPTED, DRAFT, MODERATION, etc."),
});

export async function handleGetCampaigns(params: z.infer<typeof getCampaignsSchema>): Promise<string> {
  const selectionCriteria: Record<string, unknown> = {};
  if (params.status) {
    selectionCriteria.Statuses = [params.status];
  }

  const data = await apiPost("campaigns", "get", {
    SelectionCriteria: selectionCriteria,
    FieldNames: ["Id", "Name", "Status", "State", "DailyBudget", "Statistics"],
  });
  return JSON.stringify(data, null, 2);
}
