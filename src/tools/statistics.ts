import { z } from "zod";
import { apiPost } from "../client.js";

export const getStatisticsSchema = z.object({
  campaign_id: z.number().describe("ID рекламной кампании"),
  date_from: z.string().describe("Дата начала в формате YYYY-MM-DD"),
  date_to: z.string().describe("Дата окончания в формате YYYY-MM-DD"),
});

export async function handleGetStatistics(params: z.infer<typeof getStatisticsSchema>): Promise<string> {
  const data = await apiPost("reports", "get", {
    SelectionCriteria: {
      DateFrom: params.date_from,
      DateTo: params.date_to,
      Filter: [{ Field: "CampaignId", Operator: "EQUALS", Values: [String(params.campaign_id)] }],
    },
    FieldNames: ["Date", "CampaignName", "Impressions", "Clicks", "Cost", "Ctr", "AvgCpc"],
    ReportName: `report_${Date.now()}`,
    ReportType: "CAMPAIGN_PERFORMANCE_REPORT",
    DateRangeType: "CUSTOM_DATE",
    Format: "TSV",
    IncludeVAT: "YES",
  });
  return JSON.stringify(data, null, 2);
}
