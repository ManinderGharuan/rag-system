class ConversationService {
  constructor({ conversationRepository }) {
    this.conversationRepository = conversationRepository;
  }

  // Formats history into a readable string for prompt
  formatHistory(messages) {
    return messages
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');
  }

  async getFormattedHistory(sessionId) {
    const messages = await this.conversationRepository.getHistory(sessionId);
    return {
      raw: messages,
      formatted: this.formatHistory(messages),
      isEmpty: messages.length === 0,
    };
  }

  async saveExchange({ sessionId, question, answer, source }) {
    await this.conversationRepository.saveMessage({ sessionId, role: 'user', content: question, source });
    await this.conversationRepository.saveMessage({ sessionId, role: 'assistant', content: answer, source });
  }

  async clearHistory(sessionId) {
    return this.conversationRepository.clearHistory(sessionId);
  }

  async listSessions() {
    return this.conversationRepository.listSessions();
  }
}

export default ConversationService;