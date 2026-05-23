
import { HttpError } from '../../../utils/httpError.js';

export default class TreeService {
  constructor({ treeRepo, nodeRepo, optionRepo }) {
    this.treeRepo = treeRepo;
    this.nodeRepo = nodeRepo;
    this.optionRepo = optionRepo;
  }

  // Tree methods
  async createTree(data) {
    return this.treeRepo.create(data);
  }

  async getAllTrees() {
    return this.treeRepo.findAll();
  }

  async getTree(treeId) {
    const tree = await this.treeRepo.findWithNodes(treeId);
    if (!tree) throw new HttpError(404, 'Tree not found');
    return tree;
  }

  async updateTree(treeId, data) {
    const tree = await this.treeRepo.findById(treeId);
    if (!tree) throw new HttpError(404, 'Tree not found');
    return this.treeRepo.update(treeId, data);
  }

  async deleteTree(treeId) {
    const tree = await this.treeRepo.findById(treeId);
    if (!tree) throw new HttpError(404, 'Tree not found');
    return this.treeRepo.remove(treeId);
  }

  // Node methods
  async addNode(data) {
    const tree = await this.treeRepo.findById(data.treeId);
    if (!tree) throw new HttpError(404, 'Tree not found');
    return this.nodeRepo.create(data);
  }

  async updateNode(nodeId, data) {
    const node = await this.nodeRepo.findById(nodeId);
    if (!node) throw new HttpError(404, 'Node not found');

    const payload = {};
    if (data.type !== undefined) payload.type = data.type;
    if (data.content !== undefined) payload.content = data.content;
    if (data.isRoot !== undefined) payload.is_root = data.isRoot;

    return this.nodeRepo.update(nodeId, payload);
  }

  async deleteNode(nodeId) {
    const node = await this.nodeRepo.findById(nodeId);
    if (!node) throw new HttpError(404, 'Node not found');
    return this.nodeRepo.remove(nodeId);
  }

  // Option methods
  async addOption(data) {
    const node = await this.nodeRepo.findById(data.nodeId);
    if (!node) throw new HttpError(404, 'Node not found');
    if (node.type === 'leaf') throw new HttpError(400, 'Leaf nodes cannot have options');

    return this.optionRepo.create({
      nodeId: data.nodeId,
      treeId: node.tree_id,
      label: data.label,
      nextNodeId: data.nextNodeId,
      order: data.order,
    });
  }

  async updateOption(optionId, data) {
    const option = await this.optionRepo.findById(optionId);
    if (!option) throw new HttpError(404, 'Option not found');

    const payload = {};
    if (data.label !== undefined) payload.label = data.label;
    if (data.order !== undefined) payload.order = data.order;
    if (data.nextNodeId !== undefined) payload.next_node_id = data.nextNodeId;

    return this.optionRepo.update(optionId, payload);
  }

  async deleteOption(optionId) {
    const option = await this.optionRepo.findById(optionId);
    if (!option) throw new Error('Option not found');
    return this.optionRepo.remove(optionId);
  }
}
