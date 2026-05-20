import db from '../../config/database.js';
import { env } from '../../config/env.js';
import { embeddingConfig } from '../../config/embeddingConfig.js';

// Repositories
import DocumentRepository from './repositories/document.repository.js';
import ConversationRepository from './repositories/conversation.repository.js';

// Builders + Strategies
import PromptBuilder from './builders/prompt.builder.js';
import { createAiProviderStrategy } from './strategies/ai-provider.factory.js';

// Services
import ChunkingService from './services/chunking.service.js';
import EmbeddingService from './services/embedding.service.js';
import GenerationService from './services/generation.service.js';
import IngestService from './services/ingest.service.js';
import RetrieverService from './services/retriever.service.js';
import RagService from './services/rag.service.js';
import ConversationService from './services/conversation.service.js';

// Controller + Router
import RagController from './rag.controller.js';
import createRagRoutes from './rag.routes.js';

export function createRagModule() {
  // Strategies
  const aiProviderStrategy = createAiProviderStrategy({ env, embeddingConfig });

  // Repositories
  const documentRepository = new DocumentRepository(db);
  const conversationRepository = new ConversationRepository(db);

  // Services
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
  const conversationService = new ConversationService({ conversationRepository });
  const ragService = new RagService({
    retrieverService,
    generationService,
    conversationService,
  });

  // Controller
  const ragController = new RagController({
    ingestService,
    ragService,
    conversationService,
  });

  return {
    routes: createRagRoutes({ ragController }),
    services: {
      ingestService,
      ragService,
      conversationService,
      retrieverService,
      embeddingService,
      generationService,
      chunkingService,
    },
    repositories: {
      documentRepository,
      conversationRepository,
    },
  };
}
