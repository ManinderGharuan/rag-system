export default class RetrieverService {
  constructor({ embeddingService, documentRepository }) {
    this.embeddingService = embeddingService;
    this.documentRepository = documentRepository;
  }

  async retrieveRelevantChunks(question, options = {}) {
    const topK = Number(options.topK || 4);
    const queryEmbedding = await this.embeddingService.embedText(question);

    return this.documentRepository.findSimilarChunks({
      embedding: queryEmbedding,
      source: options.source || null,
      limit: topK,
    });
  }
}
