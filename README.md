# @theyahia/yandex-direct-mcp

MCP-сервер для API Яндекс.Директ v5 — кампании, группы объявлений, объявления, ключевые слова, статистика, аккаунт. 12 инструментов.

[![npm](https://img.shields.io/npm/v/@theyahia/yandex-direct-mcp)](https://www.npmjs.com/package/@theyahia/yandex-direct-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Установка

### Claude Desktop

```json
{
  "mcpServers": {
    "yandex-direct": {
      "command": "npx",
      "args": ["-y", "@theyahia/yandex-direct-mcp"],
      "env": {
        "YANDEX_DIRECT_TOKEN": "ваш_токен"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add yandex-direct -e YANDEX_DIRECT_TOKEN=ваш_токен -- npx -y @theyahia/yandex-direct-mcp
```

## Авторизация

`YANDEX_DIRECT_TOKEN` — OAuth-токен Яндекс.Директ.

## Инструменты (12)

| Инструмент | Описание |
|------------|----------|
| `list_campaigns` | Список кампаний с фильтрацией по статусу и типу |
| `get_campaign` | Детальная информация о кампании по ID |
| `create_campaign` | Создать новую кампанию |
| `update_campaign` | Обновить кампанию (название, бюджет, статус) |
| `list_ad_groups` | Группы объявлений выбранных кампаний |
| `create_ad_group` | Создать группу объявлений с таргетингом по регионам |
| `list_ads` | Объявления в группах |
| `create_text_ad` | Создать текстовое объявление |
| `list_keywords` | Ключевые слова в группах объявлений |
| `add_keywords` | Добавить ключевые фразы |
| `get_statistics` | Статистика кампаний за период (ReportService) |
| `get_account_balance` | Информация об аккаунте |

## Примеры запросов

```
Покажи все активные рекламные кампании
Создай кампанию "Летняя распродажа" с бюджетом 5000 руб/день, старт 1 мая
Какая статистика у кампаний 12345 и 67890 за последнюю неделю?
Добавь ключевые слова "купить телефон", "смартфон недорого" в группу 100
Создай объявление "Скидки до 50%" в группу 200 с ссылкой на sale.example.com
Покажи все группы объявлений кампании 12345
```

## Лицензия

MIT
