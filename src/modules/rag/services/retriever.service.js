import { HttpError } from '../../../utils/httpError.js';

export default class RetrieverService {
  constructor({ embeddingService, documentRepository }) {
    this.embeddingService = embeddingService;
    this.documentRepository = documentRepository;
  }

  async retrieveRelevantChunks(question, options = {}) {
    if (!question || !question.trim()) throw new HttpError(400, 'Question is required');
    const topK = Number(options.topK || 4);
    if (topK < 1 || topK > 50) throw new HttpError(400, 'topK must be between 1 and 50');
    const queryEmbedding = await this.embeddingService.embedText(question);

    return this.documentRepository.findSimilarChunks({
      embedding: queryEmbedding,
      source: options.source || null,
      limit: topK,
    });
  }
}
