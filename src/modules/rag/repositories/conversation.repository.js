const TABLE = 'conversations';
const MAX_HISTORY = 10; // last 10 messages (5 exchanges)

export default class ConversationRepository {
  constructor(db) {
    this.db = db;
  }

  async saveMessage({ sessionId, role, content, source = null }) {
    const [row] = await this.db(TABLE)
      .insert({ session_id: sessionId, role, content, source })
      .returning('*');
    return row;
  }

  async getHistory(sessionId) {
    return this.db(TABLE)
      .where({ session_id: sessionId })
      .orderBy('created_at', 'asc')
      .limit(MAX_HISTORY);
  }

  async clearHistory(sessionId) {
    return this.db(TABLE).where({ session_id: sessionId }).delete();
  }

  async listSessions() {
    return this.db(TABLE)
      .distinct('session_id')
      .select(
        'session_id',
        this.db.raw('MIN(created_at) as started_at'),
        this.db.raw('COUNT(*) as message_count')
      )
      .groupBy('session_id')
      .orderBy('started_at', 'desc');
  }
}