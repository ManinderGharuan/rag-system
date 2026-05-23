import { HttpError } from '../../../utils/httpError.js';

export default class EmbeddingService {
  constructor(aiProviderStrategy, embeddingConfig) {
    this.aiProviderStrategy = aiProviderStrategy;
    this.dimensions = embeddingConfig.dimensions;
    this.indexType = embeddingConfig.indexType;
  }

  embedText(text) {
    if (!text || !text.trim()) throw new HttpError(400, 'Text to embed is required');
    return this.aiProviderStrategy.embed(text);
  }

  async embedBatch(texts, options = {}) {
    const delayMs = options.delayMs ?? 300;
    const embeddings = [];

    for (const text of texts) {
      embeddings.push(await this.embedText(text));

      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    return embeddings;
  }
}
