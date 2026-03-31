---
name: ad-campaigns
description: "Анализ рекламных кампаний Яндекс.Директ"
argument-hint: <campaign_id or keyword>
allowed-tools:
  - Bash
  - Read
---

# /ad-campaigns

1. Call get_campaigns to list active campaigns
2. Call get_statistics for selected campaign
3. Call get_keywords for keyword performance
4. Format summary with spend, clicks, CTR, conversions
