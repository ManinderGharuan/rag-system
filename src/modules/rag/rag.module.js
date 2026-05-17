import db from '../../config/database.js';
import { env } from '../../config/env.js';
import { embeddingConfig } from '../../config/embeddingConfig.js';
import DocumentRepository from './repositories/document.repository.js';
import PromptBuilder from './builders/prompt.builder.js';
import ChunkingService from './services/chunking.service.js';
import EmbeddingService from './services/embedding.service.js';
import GenerationService from './services/generation.service.js';
import IngestService from './services/ingest.service.js';
import RetrieverService from './services/retriever.service.js';
import RagService from './services/rag.service.js';
import RagController from './rag.controller.js';
import createRagRoutes from './rag.routes.js';
import { createAiProviderStrategy } from './strategies/ai-provider.factory.js';

export function createRagModule() {
  const aiProviderStrategy = createAiProviderStrategy({ env, embeddingConfig });
  const documentRepository = new DocumentRepository(db);
  const chunkingService = new ChunkingService();
  const embeddingService = new EmbeddingService(aiProviderStrategy, embeddingConfig);
  const generationService = new GenerationService({
    aiProviderStrategy,
    promptBuilderFactory: () => new PromptBuilder(),
    providerName: env.aiProvider,
  });
  const retrieverService = new RetrieverService({
    embeddingService,
    documentRepository,
  });
  const ingestService = new IngestService({
    chunkingService,
    embeddingService,
    documentRepository,
  });
  const ragService = new RagService({
    retrieverService,
    generationService,
  });
  const ragController = new RagController({
    ingestService,
    ragService,
  });

  return {
    routes: createRagRoutes({ ragController }),
    services: {
      ingestService,
      ragService,
      retrieverService,
      embeddingService,
      generationService,
      chunkingService,
    },
    repositories: {
      documentRepository,
    },
  };
}
