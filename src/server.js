import http from 'node:http';
import { fileURLToPath } from 'node:url';
import app from './app.js';
import db from './config/database.js';
import { env, validateEnv } from './config/env.js';
import logger from './config/logger.js';
import { registerGracefulShutdown } from './lifecycle/gracefulShutdown.js';

export function startServer() {
  validateEnv();

  const server = http.createServer(app);

  server.requestTimeout = env.requestTimeoutMs;
  server.keepAliveTimeout = env.keepAliveTimeoutMs;
  server.headersTimeout = env.headersTimeoutMs;

  registerGracefulShutdown({
    server,
    logger,
    shutdownTimeoutMs: env.shutdownTimeoutMs,
    forceShutdownTimeoutMs: env.forceShutdownTimeoutMs,
    resources: [
      {
        name: 'postgres',
        close: () => db.destroy(),
      },
    ],
  });

  server.listen(env.port, () => {
    logger.info('server_started', {
      port: env.port,
      nodeEnv: env.nodeEnv,
    });
  });

  server.on('error', (error) => {
    logger.error('server_error', {
      error: error.message,
      stack: error.stack,
    });
  });

  return server;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer();
}
