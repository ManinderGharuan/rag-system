export default class IngestService {
  constructor({ chunkingService, embeddingService, documentRepository }) {
    this.chunkingService = chunkingService;
    this.embeddingService = embeddingService;
    this.documentRepository = documentRepository;
  }

  async ingestDocument(text, source, options = {}) {
    const chunks = this.chunkingService.chunkText(text, {
      chunkSize: options.chunkSize,
      overlap: options.overlap,
    });

    const embeddings = await this.embeddingService.embedBatch(
      chunks.map((chunk) => chunk.content),
      { delayMs: options.embeddingDelayMs },
    );

    await this.documentRepository.replaceSourceChunks(source, chunks, embeddings);

    return {
      source,
      chunks: chunks.length,
    };
  }
}
