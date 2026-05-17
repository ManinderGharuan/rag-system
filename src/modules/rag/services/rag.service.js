export default class RagService {
  constructor({ retrieverService, generationService, conversationService }) {
    this.retrieverService = retrieverService;
    this.generationService = generationService;
    this.conversationService = conversationService;
  }

  async ask(question, options = {}) {
    const similarityThreshold = Number(options.similarityThreshold ?? 0.5);

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
