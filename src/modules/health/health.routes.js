import { Router } from 'express';
import { env } from '../../config/env.js';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    provider: env.aiProvider,
  });
});

export default router;
