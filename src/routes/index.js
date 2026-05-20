import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../config/swagger.js';
import healthRoutes from '../modules/health/health.routes.js';
import { createRagModule } from '../modules/rag/rag.module.js';
import { createDecisionTreeModule } from '../modules/decision-tree/decision-tree.module.js';

const router = Router();
const ragModule = createRagModule();
const decisionTreeModule = createDecisionTreeModule();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.use(healthRoutes);
router.use('/rag', ragModule.routes);
router.use('/decision-tree', decisionTreeModule.routes);

export default router;
