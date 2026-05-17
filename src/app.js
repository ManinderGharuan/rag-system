import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index.js';
import { env } from './config/env.js';
import { requestLogger, errorLogger } from './middlewares/requestLogger.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

app.set('trust proxy', env.trustProxy);

app.use(helmet());
app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(express.json({ limit: env.jsonLimit }));
app.use(requestLogger);

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorLogger);
app.use(errorHandler);

export default app;
