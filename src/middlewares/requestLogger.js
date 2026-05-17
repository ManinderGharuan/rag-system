import crypto from 'node:crypto';
import { env } from '../config/env.js';
import logger from '../config/logger.js';

function requestLogger(req, res, next) {
  const startedAt = process.hrtime.bigint();
  const requestId = req.get('x-request-id') || crypto.randomUUID();

  req.id = requestId;
  res.setHeader('x-request-id', requestId);

  res.on('finish', () => {
    if (!env.logHealthChecks && req.originalUrl === '/api/health' && res.statusCode < 400) {
      return;
    }

    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    const statusCode = res.statusCode;
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

    logger.log(level, 'http_request_completed', {
      requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      ip: req.ip,
      userAgent: req.get('user-agent'),
      contentLength: Number(res.get('content-length')) || 0,
    });
  });

  next();
}

function errorLogger(err, req, res, next) {
  logger.error('http_request_failed', {
    requestId: req.id,
    method: req.method,
    path: req.originalUrl || req.url,
    statusCode: err.statusCode || 500,
    message: err.message,
    stack: err.stack,
  });

  next(err);
}

export { requestLogger, errorLogger };
