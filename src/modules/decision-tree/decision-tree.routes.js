
import { Router } from 'express';
import { validateBody } from '../../middlewares/validateRequest.js';
import {
  createTreeSchema,
  updateTreeSchema,
  createNodeSchema,
  updateNodeSchema,
  createOptionSchema,
  updateOptionSchema,
  startSessionSchema,
  traverseSchema,
} from './decision-tree.validation.js';

const createDecisionTreeRouter = (controller) => {
  const router = Router();

  // ── Admin: Trees ───────────────────────────────────────
  /**
   * @swagger
   * /api/decision-tree/trees:
   *   post:
   *     summary: Create a new decision tree
   *     tags: [DecisionTree]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TreeCreateRequest'
   *     responses:
   *       201:
   *         description: Tree created successfully
   *       400:
   *         description: Validation error
   */
  router.post('/trees', validateBody(createTreeSchema), controller.createTree);

  /**
   * @swagger
   * /api/decision-tree/trees:
   *   get:
   *     summary: List all decision trees
   *     tags: [DecisionTree]
   *     responses:
   *       200:
   *         description: List of decision trees
   */
  router.get('/trees', controller.getAllTrees);

  /**
   * @swagger
   * /api/decision-tree/trees/{treeId}:
   *   get:
   *     summary: Get a decision tree with nodes and options
   *     tags: [DecisionTree]
   *     parameters:
   *       - in: path
   *         name: treeId
   *         required: true
   *         schema:
   *           type: string
   *         description: Tree identifier
   *     responses:
   *       200:
   *         description: Tree details
   *       404:
   *         description: Tree not found
   */
  router.get('/trees/:treeId', controller.getTree);

  /**
   * @swagger
   * /api/decision-tree/trees/{treeId}:
   *   put:
   *     summary: Update a decision tree
   *     tags: [DecisionTree]
   *     parameters:
   *       - in: path
   *         name: treeId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TreeUpdateRequest'
   *     responses:
   *       200:
   *         description: Tree updated successfully
   *       400:
   *         description: Validation error
   */
  router.put('/trees/:treeId', validateBody(updateTreeSchema), controller.updateTree);

  /**
   * @swagger
   * /api/decision-tree/trees/{treeId}:
   *   delete:
   *     summary: Delete a decision tree
   *     tags: [DecisionTree]
   *     parameters:
   *       - in: path
   *         name: treeId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Tree deleted
   */
  router.delete('/trees/:treeId', controller.deleteTree);

  // ── Admin: Nodes ───────────────────────────────────────
  /**
   * @swagger
   * /api/decision-tree/trees/{treeId}/nodes:
   *   post:
   *     summary: Add a node to a decision tree
   *     tags: [DecisionTree]
   *     parameters:
   *       - in: path
   *         name: treeId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/NodeCreateRequest'
   *     responses:
   *       201:
   *         description: Node created successfully
   */
  router.post('/trees/:treeId/nodes', validateBody(createNodeSchema), controller.addNode);

  /**
   * @swagger
   * /api/decision-tree/nodes/{nodeId}:
   *   put:
   *     summary: Update a decision tree node
   *     tags: [DecisionTree]
   *     parameters:
   *       - in: path
   *         name: nodeId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/NodeUpdateRequest'
   *     responses:
   *       200:
   *         description: Node updated successfully
   */
  router.put('/nodes/:nodeId', validateBody(updateNodeSchema), controller.updateNode);

  /**
   * @swagger
   * /api/decision-tree/nodes/{nodeId}:
   *   delete:
   *     summary: Delete a decision tree node
   *     tags: [DecisionTree]
   *     parameters:
   *       - in: path
   *         name: nodeId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Node deleted
   */
  router.delete('/nodes/:nodeId', controller.deleteNode);

  // ── Admin: Options ─────────────────────────────────────
  /**
   * @swagger
   * /api/decision-tree/nodes/{nodeId}/options:
   *   post:
   *     summary: Add an option to a node
   *     tags: [DecisionTree]
   *     parameters:
   *       - in: path
   *         name: nodeId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/OptionCreateRequest'
   *     responses:
   *       201:
   *         description: Option created successfully
   */
  router.post('/nodes/:nodeId/options', validateBody(createOptionSchema), controller.addOption);

  /**
   * @swagger
   * /api/decision-tree/options/{optionId}:
   *   put:
   *     summary: Update an option on a node
   *     tags: [DecisionTree]
   *     parameters:
   *       - in: path
   *         name: optionId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/OptionUpdateRequest'
   *     responses:
   *       200:
   *         description: Option updated successfully
   */
  router.put('/options/:optionId', validateBody(updateOptionSchema), controller.updateOption);

  /**
   * @swagger
   * /api/decision-tree/options/{optionId}:
   *   delete:
   *     summary: Delete an option from a node
   *     tags: [DecisionTree]
   *     parameters:
   *       - in: path
   *         name: optionId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Option deleted
   */
  router.delete('/options/:optionId', controller.deleteOption);

  // ── User: Traversal ────────────────────────────────────
  /**
   * @swagger
   * /api/decision-tree/trees/{treeId}/start:
   *   post:
   *     summary: Start a decision tree session
   *     tags: [DecisionTree]
   *     parameters:
   *       - in: path
   *         name: treeId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: false
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TreeStartRequest'
   *     responses:
   *       200:
   *         description: Session started
   */
  router.post('/trees/:treeId/start', validateBody(startSessionSchema), controller.startSession);

  /**
   * @swagger
   * /api/decision-tree/traverse:
   *   post:
   *     summary: Move to the next node in a decision tree session
   *     tags: [DecisionTree]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TraverseRequest'
   *     responses:
   *       200:
   *         description: Next node returned
   *       400:
   *         description: Validation error or traversal error
   */
  router.post('/traverse', validateBody(traverseSchema), controller.traverse);

  /**
   * @swagger
   * /api/decision-tree/sessions/{sessionId}/path:
   *   get:
   *     summary: Retrieve the traversal path for a session
   *     tags: [DecisionTree]
   *     parameters:
   *       - in: path
   *         name: sessionId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Session path details
   */
  router.get('/sessions/:sessionId/path', controller.getSessionPath);

  return router;
};

export default createDecisionTreeRouter;