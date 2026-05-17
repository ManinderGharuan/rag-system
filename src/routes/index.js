import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../config/swagger.js';
import healthRoutes from '../modules/health/health.routes.js';
import { createRagModule } from '../modules/rag/rag.module.js';

const router = Router();
const ragModule = createRagModule();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.use(healthRoutes);
router.use('/rag', ragModule.routes);

export default router;
