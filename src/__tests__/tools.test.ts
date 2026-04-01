import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally before importing modules
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Set env before imports
process.env.YANDEX_DIRECT_TOKEN = "test-token-123";

function mockOk(data: unknown) {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(typeof data === "string" ? data : JSON.stringify(data)),
  };
}

function mockError(status: number, body = "") {
  return {
    ok: false,
    status,
    statusText: "Error",
    text: () => Promise.resolve(body),
  };
}

// ─── list_campaigns ───

describe("list_campaigns", () => {
  beforeEach(() => mockFetch.mockReset());

  it("returns campaigns list", async () => {
    const { handleListCampaigns } = await import("../tools/campaigns.js");
    const payload = { result: { Campaigns: [{ Id: 1, Name: "Test", Status: "ACCEPTED" }] } };
    mockFetch.mockResolvedValueOnce(mockOk(payload));

    const result = JSON.parse(await handleListCampaigns({}));
    expect(result.result.Campaigns).toHaveLength(1);
    expect(result.result.Campaigns[0].Id).toBe(1);
  });

  it("passes status filter", async () => {
    const { handleListCampaigns } = await import("../tools/campaigns.js");
    mockFetch.mockResolvedValueOnce(mockOk({ result: { Campaigns: [] } }));

    await handleListCampaigns({ status: "DRAFT" });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.params.SelectionCriteria.Statuses).toEqual(["DRAFT"]);
  });
});

// ─── get_campaign ───

describe("get_campaign", () => {
  beforeEach(() => mockFetch.mockReset());

  it("fetches campaign by ID", async () => {
    const { handleGetCampaign } = await import("../tools/campaigns.js");
    const payload = { result: { Campaigns: [{ Id: 42, Name: "My Campaign" }] } };
    mockFetch.mockResolvedValueOnce(mockOk(payload));

    const result = JSON.parse(await handleGetCampaign({ campaign_id: 42 }));
    expect(result.result.Campaigns[0].Id).toBe(42);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.params.SelectionCriteria.Ids).toEqual([42]);
  });
});

// ─── create_campaign ───

describe("create_campaign", () => {
  beforeEach(() => mockFetch.mockReset());

  it("sends add request with campaign data", async () => {
    const { handleCreateCampaign } = await import("../tools/campaigns.js");
    mockFetch.mockResolvedValueOnce(mockOk({ result: { AddResults: [{ Id: 100 }] } }));

    const result = JSON.parse(await handleCreateCampaign({
      name: "New Campaign",
      type: "TEXT_CAMPAIGN",
      start_date: "2026-04-01",
      daily_budget: 5000000,
    }));
    expect(result.result.AddResults[0].Id).toBe(100);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.method).toBe("add");
    expect(body.params.Campaigns[0].Name).toBe("New Campaign");
    expect(body.params.Campaigns[0].DailyBudget.Amount).toBe(5000000);
  });
});

// ─── list_ad_groups ───

describe("list_ad_groups", () => {
  beforeEach(() => mockFetch.mockReset());

  it("fetches ad groups by campaign IDs", async () => {
    const { handleListAdGroups } = await import("../tools/ad_groups.js");
    const payload = { result: { AdGroups: [{ Id: 10, Name: "Group 1", CampaignId: 1 }] } };
    mockFetch.mockResolvedValueOnce(mockOk(payload));

    const result = JSON.parse(await handleListAdGroups({ campaign_ids: [1, 2] }));
    expect(result.result.AdGroups).toHaveLength(1);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.params.SelectionCriteria.CampaignIds).toEqual([1, 2]);
  });
});

// ─── create_text_ad ───

describe("create_text_ad", () => {
  beforeEach(() => mockFetch.mockReset());

  it("sends ad with title, text, href", async () => {
    const { handleCreateTextAd } = await import("../tools/ads.js");
    mockFetch.mockResolvedValueOnce(mockOk({ result: { AddResults: [{ Id: 200 }] } }));

    await handleCreateTextAd({
      ad_group_id: 10,
      title: "Buy Now",
      text: "Best deals here",
      href: "https://example.com",
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.method).toBe("add");
    expect(body.params.Ads[0].TextAd.Title).toBe("Buy Now");
    expect(body.params.Ads[0].TextAd.Href).toBe("https://example.com");
    expect(body.params.Ads[0].AdGroupId).toBe(10);
  });
});

// ─── add_keywords ───

describe("add_keywords", () => {
  beforeEach(() => mockFetch.mockReset());

  it("sends keywords array", async () => {
    const { handleAddKeywords } = await import("../tools/keywords.js");
    mockFetch.mockResolvedValueOnce(mockOk({ result: { AddResults: [{ Id: 300 }, { Id: 301 }] } }));

    await handleAddKeywords({
      ad_group_id: 10,
      keywords: ["купить телефон", "смартфон недорого"],
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.params.Keywords).toHaveLength(2);
    expect(body.params.Keywords[0].Keyword).toBe("купить телефон");
    expect(body.params.Keywords[0].AdGroupId).toBe(10);
  });
});

// ─── get_statistics ───

describe("get_statistics", () => {
  beforeEach(() => mockFetch.mockReset());

  it("sends report request with date range", async () => {
    const { handleGetStatistics } = await import("../tools/statistics.js");
    mockFetch.mockResolvedValueOnce(mockOk("Date\tCampaignName\tImpressions\n2026-01-01\tTest\t100"));

    const result = await handleGetStatistics({
      campaign_ids: [1],
      date_from: "2026-01-01",
      date_to: "2026-01-31",
    });
    expect(result).toContain("Impressions");
  });
});

// ─── Error handling ───

describe("error handling", () => {
  beforeEach(() => mockFetch.mockReset());

  it("throws on missing token", async () => {
    const saved = process.env.YANDEX_DIRECT_TOKEN;
    delete process.env.YANDEX_DIRECT_TOKEN;

    const { apiPost } = await import("../client.js");
    await expect(apiPost("campaigns", "get")).rejects.toThrow("YANDEX_DIRECT_TOKEN");

    process.env.YANDEX_DIRECT_TOKEN = saved;
  });

  it("throws on HTTP 4xx errors", async () => {
    const { handleListCampaigns } = await import("../tools/campaigns.js");
    mockFetch.mockResolvedValueOnce(mockError(403, "Forbidden"));

    await expect(handleListCampaigns({})).rejects.toThrow("HTTP 403");
  });
});

// ─── Auth header ───

describe("auth header", () => {
  beforeEach(() => mockFetch.mockReset());

  it("sends Bearer token in Authorization header", async () => {
    const { handleListCampaigns } = await import("../tools/campaigns.js");
    mockFetch.mockResolvedValueOnce(mockOk({ result: { Campaigns: [] } }));

    await handleListCampaigns({});

    const opts = mockFetch.mock.calls[0][1];
    expect(opts.headers.Authorization).toBe("Bearer test-token-123");
  });
});
