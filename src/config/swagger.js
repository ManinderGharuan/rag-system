import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env.js';

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RAG System API',
      version: '1.0.0',
      description: 'Retrieval-Augmented Generation API using Express, Knex, PostgreSQL, and pgvector.',
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
      },
    ],
    components: {
      schemas: {
        IngestRequest: {
          type: 'object',
          required: ['source', 'text'],
          properties: {
            source: { type: 'string', example: 'policy.txt' },
            text: { type: 'string', example: 'Document text to ingest.' },
            chunkSize: { type: 'integer', minimum: 100, maximum: 5000, example: 500 },
            overlap: { type: 'integer', minimum: 0, maximum: 1000, example: 100 },
          },
        },
        AskRequest: {
          type: 'object',
          required: ['question'],
          properties: {
            question: { type: 'string', example: 'What does the policy say?' },
            source: { type: 'string', example: 'policy.txt' },
            topK: { type: 'integer', minimum: 1, maximum: 20, default: 4 },
            similarityThreshold: { type: 'number', minimum: 0, maximum: 1, default: 0.5 },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.js'],
});

export default swaggerSpec;
