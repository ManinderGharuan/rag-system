import { HttpError } from '../../../utils/httpError.js';

export default class RagService {
  constructor({ retrieverService, generationService, conversationService }) {
    this.retrieverService = retrieverService;
    this.generationService = generationService;
    this.conversationService = conversationService;
  }

  async ask(question, options = {}) {
    if (!question || !question.trim()) throw new HttpError(400, 'Question is required');
    const similarityThreshold = Number(options.similarityThreshold ?? 0.5);
    if (similarityThreshold < 0 || similarityThreshold > 1) throw new HttpError(400, 'similarityThreshold must be between 0 and 1');

    const history = options.sessionId
      ? await this.conversationService.getFormattedHistory(options.sessionId)
      : { formatted: '', isEmpty: true };

    const chunks = await this.retrieverService.retrieveRelevantChunks(question, options);
    const relevantChunks = chunks.filter((chunk) => Number(chunk.similarity) >= similarityThreshold);

    if (!relevantChunks.length) {
      let answer = "I couldn't find relevant information to answer your question.";

      if (options.sessionId) {
        await this.conversationService.saveExchange({ sessionId: options.sessionId, question, answer, source: options.source });
      }

      return {
        answer: "I couldn't find relevant information to answer your question.",
        sources: [],
        sessionId: options.sessionId || null,
      };
    }

    const result = await this.generationService.generateAnswer(question, relevantChunks);

    if (options.sessionId) {
      await this.conversationService.saveExchange({
        sessionId: options.sessionId,
        question,
        answer: result.answer,
        source: options.source,
      });
    }

    return { ...result, sessionId: options.sessionId || null };
  }
}
