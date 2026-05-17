export default class GenerationService {
  constructor({ aiProviderStrategy, promptBuilderFactory, providerName }) {
    this.aiProviderStrategy = aiProviderStrategy;
    this.promptBuilderFactory = promptBuilderFactory;
    this.providerName = providerName;
  }

  async generateAnswer(question, chunks) {
    const prompt = this.promptBuilderFactory()
      .withDefaultInstructions()
      .withContext(chunks)
      .withQuestion(question)
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
