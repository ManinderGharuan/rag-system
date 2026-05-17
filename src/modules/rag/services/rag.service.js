export default class RagService {
  constructor({ retrieverService, generationService }) {
    this.retrieverService = retrieverService;
    this.generationService = generationService;
  }

  async ask(question, options = {}) {
    const similarityThreshold = Number(options.similarityThreshold ?? 0.5);
    const chunks = await this.retrieverService.retrieveRelevantChunks(question, options);
    const relevantChunks = chunks.filter((chunk) => Number(chunk.similarity) >= similarityThreshold);

    if (!relevantChunks.length) {
      return {
        answer: "I couldn't find relevant information to answer your question.",
        sources: [],
      };
    }

    return this.generationService.generateAnswer(question, relevantChunks);
  }
}
