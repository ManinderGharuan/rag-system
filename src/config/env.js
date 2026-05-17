import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export const env = {
  serviceName: process.env.SERVICE_NAME || 'rag-system',
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  jsonLimit: process.env.JSON_LIMIT || '1mb',
  databaseUrl: process.env.DATABASE_URL,
  aiProvider: process.env.AI_PROVIDER || 'gemini',
  openaiApiKey: process.env.OPENAI_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  logLevel: process.env.LOG_LEVEL || 'info',
  logHealthChecks: process.env.LOG_HEALTH_CHECKS === 'true',
  trustProxy: process.env.TRUST_PROXY === 'true',
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS),
  shutdownTimeoutMs: Number(process.env.SHUTDOWN_TIMEOUT_MS || 10000),
  forceShutdownTimeoutMs: Number(process.env.FORCE_SHUTDOWN_TIMEOUT_MS || 15000),
  requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS || 30000),
  keepAliveTimeoutMs: Number(process.env.KEEP_ALIVE_TIMEOUT_MS || 5000),
  headersTimeoutMs: Number(process.env.HEADERS_TIMEOUT_MS || 6000),
};

function parseOrigins(origins) {
  if (!origins || origins === '*') return true;
  return origins.split(',').map((origin) => origin.trim()).filter(Boolean);
}

export function validateEnv() {
  const missing = [];

  if (!env.databaseUrl) missing.push('DATABASE_URL');
  if (env.aiProvider === 'openai' && !env.openaiApiKey) missing.push('OPENAI_API_KEY');
  if (env.aiProvider === 'gemini' && !env.geminiApiKey) missing.push('GEMINI_API_KEY');

  if (!['openai', 'gemini'].includes(env.aiProvider)) {
    throw new Error(`Unsupported AI_PROVIDER: ${env.aiProvider}`);
  }

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
