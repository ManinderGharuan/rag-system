import { HttpError } from '../../../utils/httpError.js';

export default class IngestService {
  constructor({ chunkingService, embeddingService, documentRepository }) {
    this.chunkingService = chunkingService;
    this.embeddingService = embeddingService;
    this.documentRepository = documentRepository;
  }

  async ingestDocument(text, source, options = {}) {
    if (!text || !text.trim()) throw new HttpError(400, 'Text content is required');
    if (!source || !source.trim()) throw new HttpError(400, 'Source identifier is required');
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
