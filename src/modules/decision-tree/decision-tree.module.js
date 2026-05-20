
import db from '../../config/database.js';

// Repositories
import TreeRepository from './repositories/tree.repository.js';
import NodeRepository from './repositories/node.repository.js';
import OptionRepository from './repositories/option.repository.js';
import SessionRepository from './repositories/session.repository.js';

// Services
import TreeService from './services/tree.service.js';
import TraversalService from './services/traversal.service.js';

// Controller + Router
import DecisionTreeController from './decision-tree.controller.js';
import createDecisionTreeRouter from './decision-tree.routes.js';

export function createDecisionTreeModule() {
  // Repositories
  const treeRepo = new TreeRepository(db);
  const nodeRepo = new NodeRepository(db);
  const optionRepo = new OptionRepository(db);
  const sessionRepo = new SessionRepository(db);

  // Services
  const treeService = new TreeService({ treeRepo, nodeRepo, optionRepo });
  const traversalService = new TraversalService({ nodeRepo, optionRepo, sessionRepo });

  // Controller
  const controller = new DecisionTreeController({ treeService, traversalService });

  return {
    routes: createDecisionTreeRouter(controller),
    services: {
      treeService,
      traversalService,
    },
    repositories: {
      treeRepo,
      nodeRepo,
      optionRepo,
      sessionRepo,
    },
  };
}
