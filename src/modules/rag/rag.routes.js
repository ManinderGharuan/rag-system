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
   *             $ref: '#/components/schemas/IngestRequest'
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
   *             $ref: '#/components/schemas/AskRequest'
   *     responses:
   *       200:
   *         description: Generated answer with matching sources
   *       400:
   *         description: Validation error
   */
  router.post('/ask', validateBody(askSchema), ragController.ask);

  return router;
}
