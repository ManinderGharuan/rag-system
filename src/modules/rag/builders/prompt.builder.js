export default class PromptBuilder {
  constructor() {
    this.instructions = [];
    this.contextChunks = [];
    this.question = '';
    this.history = '';
  }

  withDefaultInstructions() {
    this.instructions = [
      'You are a helpful assistant.',
      `Answer the user's question using ONLY the context provided below.`,
      `If the answer is not in the context, say "I don't have enough information to answer that."`,
      `Do not make up information. Use the conversation history to understand follow-up questions.`,
    ];

    return this;
  }

  withContext(chunks) {
    this.contextChunks = chunks;
    return this;
  }

  withQuestion(question) {
    this.question = question;
    return this;
  }

  withHistory(history) {
    this.history = history;
    return this;
  }

  build() {
    const context = this.contextChunks
      .map((chunk, index) => `[Source ${index + 1}] ${chunk.content}`)
      .join('\n\n');

    const historySection = this.history
      ? `CONVERSATION HISTORY (for context only):
${history}

`
      : '';

    return `${this.instructions.join(' ')}

CONTEXT:
${context}

${historySection}CURRENT QUESTION: ${this.question}

ANSWER:`;
  }
}
