export default class PromptBuilder {
  constructor() {
    this.instructions = [];
    this.contextChunks = [];
    this.question = '';
  }

  withDefaultInstructions() {
    this.instructions = [
      'You are a helpful assistant.',
      'Answer the user question using ONLY the context provided below.',
      'If the answer is not in the context, say "I do not have enough information to answer that."',
      'Do not make up information.',
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

  build() {
    const context = this.contextChunks
      .map((chunk, index) => `[Source ${index + 1}] ${chunk.content}`)
      .join('\n\n');

    return `${this.instructions.join(' ')}

CONTEXT:
${context}

QUESTION: ${this.question}

ANSWER:`;
  }
}
