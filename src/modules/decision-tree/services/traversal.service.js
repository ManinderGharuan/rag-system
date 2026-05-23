
import { v4 as uuidv4 } from 'uuid';
import { HttpError } from '../../../utils/httpError.js';

export default class TraversalService {
  constructor({ nodeRepo, optionRepo, sessionRepo }) {
    this.nodeRepo = nodeRepo;
    this.optionRepo = optionRepo;
    this.sessionRepo = sessionRepo;

    this.startSession = this.startSession.bind(this);
    this.traverse = this.traverse.bind(this);
    this.getSessionPath = this.getSessionPath.bind(this);
  }

  // Format a node response consistently
  formatNode(node) {
    return {
      nodeId:    node.id,
      type:      node.type,
      content:   node.content,
      isLeaf:    node.type === 'leaf',
      options:   node.options?.map(o => ({
        optionId: o.id,
        label:    o.label,
        order:    o.order
      })) ?? []
    };
  }

  // Start a new session — returns root node
  async startSession({ treeId, sessionId = uuidv4() }) {
    const rootNode = await this.nodeRepo.findRootByTreeId(treeId);
    if (!rootNode) throw new HttpError(404, 'Tree has no root node');

    const nodeWithOptions = await this.nodeRepo.findWithOptions(rootNode.id);

    // Create session at root
    await this.sessionRepo.createSession({ sessionId, treeId, rootNodeId: rootNode.id });

    // Log first step
    await this.sessionRepo.logStep({ sessionId, nodeId: rootNode.id });

    return {
      sessionId,
      ...this.formatNode(nodeWithOptions),
    };
  }

  // User picks an option — returns next node
  async traverse({ sessionId, optionId }) {
    // 1. Validate session exists and is active
    const session = await this.sessionRepo.findSession(sessionId);
    if (!session) throw new HttpError(404, 'Session not found or already completed');

    // 2. Validate option exists
    const option = await this.optionRepo.findById(optionId);
    if (!option) throw new HttpError(404, 'Option not found');

    // 3. Validate option belongs to current node
    if (option.node_id !== session.current_node_id) {
      throw new HttpError(400, 'Option does not belong to current node');
    }

    // 4. Get next node
    if (!option.next_node_id) throw new HttpError(400, 'Option has no linked next node');
    const nextNode = await this.nodeRepo.findWithOptions(option.next_node_id);
    if (!nextNode) throw new HttpError(404, 'Next node not found');

    // 5. Log this step
    await this.sessionRepo.logStep({ sessionId, nodeId: nextNode.id, optionId });

    // 6. Update session — mark completed if leaf reached
    const isLeaf = nextNode.type === 'leaf';
    await this.sessionRepo.updateSession(sessionId, {
      currentNodeId: nextNode.id,
      status: isLeaf ? 'completed' : 'active',
      completedAt: isLeaf ? new Date() : null,
    });

    return {
      sessionId,
      ...this.formatNode(nextNode),
    };
  }

  // Get full path user took through the tree
  async getSessionPath(sessionId) {
    const session = await this.sessionRepo.findSession(sessionId);
    const steps   = await this.sessionRepo.getSteps(sessionId);
    return { session, steps };
  }
}
