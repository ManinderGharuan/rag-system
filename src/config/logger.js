import winston from 'winston';
import { env } from './env.js';

const logger = winston.createLogger({
  level: env.logLevel,
  defaultMeta: {
    service: env.serviceName,
    environment: env.nodeEnv,
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
