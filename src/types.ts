export interface DirectCampaign {
  Id: number;
  Name: string;
  Status: string;
  State: string;
  DailyBudget?: { Amount: number; Mode: string };
  StartDate?: string;
  Type?: string;
}

export interface DirectAdGroup {
  Id: number;
  Name: string;
  CampaignId: number;
  RegionIds: number[];
  Status: string;
  Type: string;
}

export interface DirectAd {
  Id: number;
  CampaignId: number;
  AdGroupId: number;
  State: string;
  Status: string;
  TextAd?: { Title: string; Title2?: string; Text: string; Href: string };
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
