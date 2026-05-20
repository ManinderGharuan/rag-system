
export default class DecisionTreeController {
  constructor({ treeService, traversalService }) {
    this.treeService = treeService;
    this.traversalService = traversalService;

    // Admin
    this.createTree = this.createTree.bind(this);
    this.getAllTrees = this.getAllTrees.bind(this);
    this.getTree = this.getTree.bind(this);
    this.updateTree = this.updateTree.bind(this);
    this.deleteTree = this.deleteTree.bind(this);
    this.addNode = this.addNode.bind(this);
    this.updateNode = this.updateNode.bind(this);
    this.deleteNode = this.deleteNode.bind(this);
    this.addOption = this.addOption.bind(this);
    this.updateOption = this.updateOption.bind(this);
    this.deleteOption = this.deleteOption.bind(this);

    // User traversal
    this.startSession = this.startSession.bind(this);
    this.traverse = this.traverse.bind(this);
    this.getSessionPath = this.getSessionPath.bind(this);
  }

  async createTree(req, res, next) {
    try {
      const tree = await this.treeService.createTree(req.body);
      res.status(201).json({ success: true, data: tree });
    } catch (err) {
      next(err);
    }
  }

  async getAllTrees(req, res, next) {
    try {
      const trees = await this.treeService.getAllTrees();
      res.json({ success: true, data: trees });
    } catch (err) {
      next(err);
    }
  }

  async getTree(req, res, next) {
    try {
      const tree = await this.treeService.getTree(req.params.treeId);
      res.json({ success: true, data: tree });
    } catch (err) {
      next(err);
    }
  }

  async updateTree(req, res, next) {
    try {
      const tree = await this.treeService.updateTree(req.params.treeId, req.body);
      res.json({ success: true, data: tree });
    } catch (err) {
      next(err);
    }
  }

  async deleteTree(req, res, next) {
    try {
      await this.treeService.deleteTree(req.params.treeId);
      res.json({ success: true, message: 'Tree deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  async addNode(req, res, next) {
    try {
      const node = await this.treeService.addNode({ treeId: req.params.treeId, ...req.body });
      res.status(201).json({ success: true, data: node });
    } catch (err) {
      next(err);
    }
  }

  async updateNode(req, res, next) {
    try {
      const node = await this.treeService.updateNode(req.params.nodeId, req.body);
      res.json({ success: true, data: node });
    } catch (err) {
      next(err);
    }
  }

  async deleteNode(req, res, next) {
    try {
      await this.treeService.deleteNode(req.params.nodeId);
      res.json({ success: true, message: 'Node deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  async addOption(req, res, next) {
    try {
      const option = await this.treeService.addOption({ nodeId: req.params.nodeId, ...req.body });
      res.status(201).json({ success: true, data: option });
    } catch (err) {
      next(err);
    }
  }

  async updateOption(req, res, next) {
    try {
      const option = await this.treeService.updateOption(req.params.optionId, req.body);
      res.json({ success: true, data: option });
    } catch (err) {
      next(err);
    }
  }

  async deleteOption(req, res, next) {
    try {
      await this.treeService.deleteOption(req.params.optionId);
      res.json({ success: true, message: 'Option deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  async startSession(req, res, next) {
    try {
      const result = await this.traversalService.startSession({
        treeId: req.params.treeId,
        sessionId: req.body.sessionId,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async traverse(req, res, next) {
    try {
      const result = await this.traversalService.traverse(req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getSessionPath(req, res, next) {
    try {
      const path = await this.traversalService.getSessionPath(req.params.sessionId);
      res.json({ success: true, data: path });
    } catch (err) {
      next(err);
    }
  }
}
