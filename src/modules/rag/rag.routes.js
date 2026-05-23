import { Router } from 'express';
import { validateBody } from '../../middlewares/validateRequest.js';
import { ingestSchema, askSchema } from './rag.validation.js';

export default function createRagRoutes({ ragController }) {
  const router = Router();

  /**
   * @swagger
   * /api/rag/ingest:
   *   post:
   *     summary: Ingest a document into the vector store
   *     tags: [RAG]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/rag.ingest'
   *     responses:
   *       201:
   *         description: Document ingested
   *       400:
   *         description: Validation error
   */
  router.post('/ingest', validateBody(ingestSchema), ragController.ingest);

  /**
   * @swagger
   * /api/rag/ask:
   *   post:
   *     summary: Ask a question against ingested documents
   *     tags: [RAG]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/rag.ask'
   *     responses:
   *       200:
   *         description: Generated answer with matching sources
   *       400:
   *         description: Validation error
   */
  router.post('/ask', validateBody(askSchema), ragController.ask);

  /**
   * @swagger
   * /api/rag/conversation/{sessionId}:
   *   get:
   *     summary: Get conversation history for a session
   *     tags: [RAG]
   *     parameters:
   *       - in: path
   *         name: sessionId
   *         required: true
   *         schema:
   *           type: string
   *         description: Session identifier
   *     responses:
   *       200:
   *         description: Conversation history
   */
  router.get('/conversation/:sessionId', ragController.getConversation);

  /**
   * @swagger
   * /api/rag/conversation/{sessionId}:
   *   delete:
   *     summary: Delete/clear conversation history for a session
   *     tags: [RAG]
   *     parameters:
   *       - in: path
   *         name: sessionId
   *         required: true
   *         schema:
   *           type: string
   *         description: Session identifier
   *     responses:
   *       200:
   *         description: Deletion result
   */
  router.delete('/conversation/:sessionId', ragController.deleteConversation);

  /**
   * @swagger
   * /api/rag/sessions:
   *   get:
   *     summary: List active conversation sessions
   *     tags: [RAG]
   *     responses:
   *       200:
   *         description: List of sessions
   */
  router.get('/sessions', ragController.listSessions);

  return router;
}
