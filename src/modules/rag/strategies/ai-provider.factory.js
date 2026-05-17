import OpenAIStrategy from './openai.strategy.js';
import GeminiStrategy from './gemini.strategy.js';

export function createAiProviderStrategy({ env, embeddingConfig }) {
  if (env.aiProvider === 'openai') {
    return new OpenAIStrategy({
      apiKey: env.openaiApiKey,
      embeddingModel: embeddingConfig.embeddingModel,
      chatModel: embeddingConfig.chatModel,
    });
  }

  if (env.aiProvider === 'gemini') {
    return new GeminiStrategy({
      apiKey: env.geminiApiKey,
      embeddingModel: embeddingConfig.embeddingModel,
      chatModel: embeddingConfig.chatModel,
      dimensions: embeddingConfig.dimensions,
    });
  }

  throw new Error(`Unsupported AI_PROVIDER: ${env.aiProvider}`);
}
