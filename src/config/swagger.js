import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env.js';
import swaggerSchemas from '../schemas/index.js';

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
      schemas: swaggerSchemas,
    },
  },
  apis: ['./src/modules/**/*.js'],
});

export default swaggerSpec;
