import { HttpError } from '../../../utils/httpError.js';

export default class GenerationService {
  constructor({ aiProviderStrategy, promptBuilderFactory, providerName }) {
    this.aiProviderStrategy = aiProviderStrategy;
    this.promptBuilderFactory = promptBuilderFactory;
    this.providerName = providerName;
  }

  async generateAnswer(question, chunks, history = '') {
    if (!question || !question.trim()) throw new HttpError(400, 'Question is required');
    if (!Array.isArray(chunks) || chunks.length === 0) throw new HttpError(400, 'At least one chunk is required');
    const prompt = this.promptBuilderFactory()
      .withDefaultInstructions()
      .withContext(chunks)
      .withQuestion(question)
      .withHistory(history)
      .build();

    const answer = await this.aiProviderStrategy.generate(prompt);

    return {
      answer,
      provider: this.providerName,
      sources: chunks.map((chunk) => ({
        source: chunk.source,
        similarity: Number.parseFloat(chunk.similarity).toFixed(4),
        preview: `${chunk.content.slice(0, 100)}...`,
      })),
    };
  }
}
