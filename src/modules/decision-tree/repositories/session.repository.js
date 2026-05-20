
const SESSIONS = 'tree_sessions';
const STEPS    = 'tree_session_steps';

export default class SessionRepository {
  constructor(db) {
    this.db = db;
  }

  async create({ sessionId, treeId, rootNodeId }) {
    const [row] = await this.db(SESSIONS)
      .insert({ session_id: sessionId, tree_id: treeId, current_node_id: rootNodeId })
      .returning('*');
    return row;
  }

  async findById(sessionId) {
    return this.db(SESSIONS).where({ session_id: sessionId, status: 'active' }).first();
  }

  async update(sessionId, { currentNodeId, status, completedAt }) {
    const data = {};
    if (currentNodeId) data.current_node_id = currentNodeId;
    if (status)        data.status = status;
    if (completedAt)   data.completed_at = completedAt;
    data.updated_at = new Date();

    const [row] = await this.db(SESSIONS)
      .where({ session_id: sessionId })
      .update(data)
      .returning('*');
    return row;
  }

  async logStep({ sessionId, nodeId, optionId = null }) {
    const [row] = await this.db(STEPS)
      .insert({ session_id: sessionId, node_id: nodeId, option_id: optionId })
      .returning('*');
    return row;
  }

  async getSteps(sessionId) {
    return this.db(STEPS)
      .where({ session_id: sessionId })
      .orderBy('created_at', 'asc');
  }
}
