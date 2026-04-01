import { z } from "zod";
import { apiReport } from "../client.js";

export const getStatisticsSchema = z.object({
  campaign_ids: z.array(z.number()).describe("ID кампаний для отчёта"),
  date_from: z.string().describe("Дата начала в формате YYYY-MM-DD"),
  date_to: z.string().describe("Дата окончания в формате YYYY-MM-DD"),
  fields: z.array(z.string()).optional().describe("Поля отчёта (по умолчанию: Date, CampaignName, Impressions, Clicks, Cost, Ctr, AvgCpc)"),
});

export async function handleGetStatistics(params: z.infer<typeof getStatisticsSchema>): Promise<string> {
  const fields = params.fields ?? ["Date", "CampaignName", "Impressions", "Clicks", "Cost", "Ctr", "AvgCpc"];
  const data = await apiReport({
    SelectionCriteria: {
      DateFrom: params.date_from,
      DateTo: params.date_to,
      Filter: [{
        Field: "CampaignId",
        Operator: "IN",
        Values: params.campaign_ids.map(String),
      }],
    },
    FieldNames: fields,
    ReportName: `report_${Date.now()}`,
    ReportType: "CAMPAIGN_PERFORMANCE_REPORT",
    DateRangeType: "CUSTOM_DATE",
    Format: "TSV",
    IncludeVAT: "YES",
  });
  return data;
}
