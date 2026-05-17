# RAG System

A small Retrieval-Augmented Generation API built with Node.js, Express, Knex, PostgreSQL, and pgvector.

## Features

- Document ingestion with overlapping text chunks
- Embeddings through Gemini or OpenAI
- Vector similarity search with pgvector
- Answer generation constrained to retrieved context
- Knex-powered database migrations
- Joi request validation
- Swagger UI generated from JSDoc route annotations
- CORS, Helmet, proxy trust config, and compact Winston API logs
- Graceful shutdown with HTTP connection draining and database pool cleanup
- Feature-first project structure for RAG routes, controllers, validation, services, and repository code
- Dependency Injection through the RAG module composition root
- Strategy and Factory patterns for AI provider selection
- Builder pattern for prompt construction
- Native ESM import/export syntax through `"type": "module"`

## Project Structure

```txt
.
├── db/
│   ├── knexfile.js
│   └── migrations/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── middlewares/
│   ├── modules/
│   │   ├── health/
│   │   │   └── health.routes.js
│   │   └── rag/
│   │       ├── builders/
│   │       ├── repositories/
│   │       ├── services/
│   │       ├── strategies/
│   │       ├── rag.controller.js
│   │       ├── rag.module.js
│   │       ├── rag.routes.js
│   │       └── rag.validation.js
│   ├── routes/
│   └── utils/
└── data/
    └── sample.txt
```

## Requirements

- Node.js 20+
- PostgreSQL with the `pgvector` extension available
- Gemini or OpenAI API key

## Setup

```bash
npm install
cp .env.example .env
npm run db:migrate
```

Update `.env` with your database URL and provider key before running migrations.

## Running

```bash
npm run dev
```

The API starts on `http://localhost:3000` by default.

Swagger UI is available at:

```txt
http://localhost:3000/api/docs
```

Available scripts:

```bash
npm run start
npm run dev
npm run test
npm run db:migrate
npm run db:rollback
npm run db:make -- migration_name
```

## API

Health:

```bash
curl http://localhost:3000/api/health
```

Ingest text:

```bash
curl -X POST http://localhost:3000/api/rag/ingest \
  -H "Content-Type: application/json" \
  -d '{"source":"policy.txt","text":"Your document text goes here."}'
```

Ask a question:

```bash
curl -X POST http://localhost:3000/api/rag/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"What does the policy say?","source":"policy.txt","topK":4}'
```

## Database

The first migration creates the `documents` table, a `vector(1536)` embedding column, a source lookup index, and an HNSW cosine vector index.

Useful commands:

```bash
npm run db:migrate
npm run db:rollback
npm run db:make -- migration_name
```

There is no separate `db/setup.js`; schema changes are managed by Knex migrations.

## Patterns

- Dependency Injection: [rag.module.js](/home/maninder/Documents/rag-system/src/modules/rag/rag.module.js) constructs and wires controllers, services, repositories, strategies, and builders.
- Repository Pattern: [document.repository.js](/home/maninder/Documents/rag-system/src/modules/rag/repositories/document.repository.js) owns persistence operations.
- Strategy Pattern: `OpenAIStrategy` and `GeminiStrategy` implement provider-specific embedding and generation behavior.
- Factory Pattern: [ai-provider.factory.js](/home/maninder/Documents/rag-system/src/modules/rag/strategies/ai-provider.factory.js) selects the provider strategy from env config.
- Builder Pattern: [prompt.builder.js](/home/maninder/Documents/rag-system/src/modules/rag/builders/prompt.builder.js) builds generation prompts consistently.

## Module System

This project uses native Node.js ESM via `"type": "module"` in `package.json`.

Use `import` / `export` syntax and include `.js` extensions for local imports:

```js
import RagController from './rag.controller.js';
import { createRagModule } from './rag.module.js';
```

Avoid `require()` and `module.exports` in application files.

## Environment

```bash
SERVICE_NAME=rag-system
PORT=3000
JSON_LIMIT=1mb
LOG_LEVEL=info
LOG_HEALTH_CHECKS=false
TRUST_PROXY=false
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
REQUEST_TIMEOUT_MS=30000
KEEP_ALIVE_TIMEOUT_MS=5000
HEADERS_TIMEOUT_MS=6000
SHUTDOWN_TIMEOUT_MS=10000
FORCE_SHUTDOWN_TIMEOUT_MS=15000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/rag_system
AI_PROVIDER=gemini
GEMINI_API_KEY=
OPENAI_API_KEY=
```

## Logging

Request logging is intentionally compact. Each completed request logs only operational fields:

- `requestId`
- `method`
- `path`
- `statusCode`
- `durationMs`
- `ip`
- `userAgent`
- `contentLength`

Successful `/api/health` requests are skipped by default to avoid noisy health-probe logs. Set `LOG_HEALTH_CHECKS=true` to include them.

## Graceful Shutdown

The server handles `SIGTERM`, `SIGINT`, `uncaughtException`, and `unhandledRejection`.

Shutdown sequence:

1. Stop accepting new HTTP connections.
2. Close idle HTTP connections when supported by the Node.js runtime.
3. Wait up to `SHUTDOWN_TIMEOUT_MS` for active requests to finish.
4. Close registered resources, currently the PostgreSQL/Knex pool.
5. Force close remaining sockets after `FORCE_SHUTDOWN_TIMEOUT_MS`.

## Notes

- Changing `AI_PROVIDER` after data has been ingested may require re-ingestion.
- Retrieval uses parameterized Knex queries, including the optional `source` filter.
- The API validates required environment variables at startup.
- Knex config and migrations are ESM files; keep migration exports as `export async function up/down`.
