
const TABLE = 'trees';

export default class TreeRepository {
  constructor(db) {
    this.db = db;
  }

  async create({ name, description }) {
    const [row] = await this.db(TABLE).insert({ name, description }).returning('*');
    return row;
  }

  async findAll() {
    return this.db(TABLE).orderBy('created_at', 'desc');
  }

  async findById(id) {
    return this.db(TABLE).where({ id }).first();
  }

  // Returns full tree — nodes + options in one query
  async findWithNodes(id) {
    const tree = await this.db(TABLE).where({ id }).first();
    if (!tree) return null;

    const nodes = await this.db('nodes').where({ tree_id: id });
    const options = await this.db('options').where({ tree_id: id }).orderBy('order');

    // Attach options to their parent node
    const nodesWithOptions = nodes.map(node => ({
      ...node,
      options: options.filter(o => o.node_id === node.id)
    }));

    return { ...tree, nodes: nodesWithOptions };
  }

  async update(id, data) {
    const [row] = await this.db(TABLE).where({ id }).update(data).returning('*');
    return row;
  }

  async remove(id) {
    return this.db(TABLE).where({ id }).delete();
  }
}
