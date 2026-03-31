export interface DirectCampaign {
  Id: number;
  Name: string;
  Status: string;
  State: string;
  DailyBudget?: { Amount: number };
}

export interface DirectAd {
  Id: number;
  CampaignId: number;
  State: string;
  Status: string;
  TextAd?: { Title: string; Text: string; Href: string };
}

export interface DirectKeyword {
  Id: number;
  Keyword: string;
  CampaignId: number;
  AdGroupId: number;
  Bid: number;
  Status: string;
}

export interface DirectApiResponse {
  result: unknown;
}
