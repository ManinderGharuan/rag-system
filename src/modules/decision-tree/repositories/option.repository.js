
const TABLE = 'options';

export default class OptionRepository {
  constructor(db) {
    this.db = db;
  }

  async create({ nodeId, treeId, label, nextNodeId = null, order = 0 }) {
    const [row] = await this.db(TABLE)
      .insert({ node_id: nodeId, tree_id: treeId, label, next_node_id: nextNodeId, order })
      .returning('*');
    return row;
  }

  async findById(id) {
    return this.db(TABLE).where({ id }).first();
  }

  async update(id, data) {
    const [row] = await this.db(TABLE).where({ id }).update(data).returning('*');
    return row;
  }

  async remove(id) {
    return this.db(TABLE).where({ id }).delete();
  }
}
