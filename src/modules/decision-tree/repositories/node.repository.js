
const TABLE   = 'nodes';
const OPTIONS = 'options';

export default class NodeRepository {
  constructor(db) {
    this.db = db;
  }

  async create({ treeId, type, content, isRoot = false }) {
    // Only one root allowed per tree — unset existing root if needed
    if (isRoot) {
      await this.db(TABLE).where({ tree_id: treeId, is_root: true }).update({ is_root: false });
    }

    const [row] = await this.db(TABLE)
      .insert({ tree_id: treeId, type, content, is_root: isRoot })
      .returning('*');
    return row;
  }

  async findById(id) {
    return this.db(TABLE).where({ id }).first();
  }

  // Get node with its options (what user sees at each step)
  async findWithOptions(id) {
    const node = await this.db(TABLE).where({ id }).first();
    if (!node) return null;

    const options = await this.db(OPTIONS)
      .where({ node_id: id })
      .orderBy('order');

    return { ...node, options };
  }

  async findRootByTreeId(treeId) {
    return this.db(TABLE).where({ tree_id: treeId, is_root: true }).first();
  }

  async update(id, data) {
    const [row] = await this.db(TABLE).where({ id }).update(data).returning('*');
    return row;
  }

  async remove(id) {
    return this.db(TABLE).where({ id }).delete();
  }
}
