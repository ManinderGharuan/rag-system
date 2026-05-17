import { env } from './env.js';

export const EMBEDDING_PROVIDERS = {
  openai: {
    dimensions: 1536,
    indexType: 'hnsw',
    embeddingModel: 'text-embedding-3-small',
    chatModel: 'gpt-4o-mini',
  },
  gemini: {
    dimensions: 1536,
    indexType: 'hnsw',
    embeddingModel: 'gemini-embedding-001',
    chatModel: 'gemini-2.5-flash',
  },
};

export const embeddingConfig = EMBEDDING_PROVIDERS[env.aiProvider];

if (!embeddingConfig) {
  throw new Error(`Unsupported AI_PROVIDER: ${env.aiProvider}`);
}
