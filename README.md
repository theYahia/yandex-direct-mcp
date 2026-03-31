# @theyahia/yandex-direct-mcp

MCP-сервер для API Яндекс.Директ — кампании, объявления, статистика, ключевые слова. Требуется OAuth-токен.

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

## Инструменты (4)

| Инструмент | Описание |
|------------|----------|
| `get_campaigns` | Список рекламных кампаний |
| `get_ads` | Объявления кампании |
| `get_statistics` | Статистика: показы, клики, расход, CTR |
| `get_keywords` | Ключевые слова кампании |

## Примеры запросов

```
Покажи все активные рекламные кампании
Какая статистика у кампании 12345 за последнюю неделю?
Какие ключевые слова в кампании?
```

## Лицензия

MIT
