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
            sessionId: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
            topK: { type: 'integer', minimum: 1, maximum: 20, default: 4 },
            similarityThreshold: { type: 'number', minimum: 0, maximum: 1, default: 0.5 },
          },
        },
        TreeCreateRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Product Support Flow' },
            description: { type: 'string', example: 'A decision tree for customer support escalation.' },
          },
        },
        TreeUpdateRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Updated product support tree' },
            description: { type: 'string', example: 'Updated description of the support flow.' },
          },
        },
        NodeCreateRequest: {
          type: 'object',
          required: ['type', 'content'],
          properties: {
            type: { type: 'string', enum: ['question', 'leaf'] },
            content: { type: 'string', example: 'What type of issue are you having?' },
            isRoot: { type: 'boolean', example: true },
          },
        },
        NodeUpdateRequest: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['question', 'leaf'] },
            content: { type: 'string', example: 'Please clarify the issue.' },
            isRoot: { type: 'boolean', example: false },
          },
        },
        OptionCreateRequest: {
          type: 'object',
          required: ['label'],
          properties: {
            label: { type: 'string', example: 'Billing issue' },
            nextNodeId: { type: 'string', format: 'uuid', nullable: true },
            order: { type: 'integer', example: 0 },
          },
        },
        OptionUpdateRequest: {
          type: 'object',
          properties: {
            label: { type: 'string', example: 'Technical issue' },
            nextNodeId: { type: 'string', format: 'uuid', nullable: true },
            order: { type: 'integer', example: 1 },
          },
        },
        TreeStartRequest: {
          type: 'object',
          properties: {
            sessionId: { type: 'string', format: 'uuid' },
          },
        },
        TraverseRequest: {
          type: 'object',
          required: ['sessionId', 'optionId'],
          properties: {
            sessionId: { type: 'string', format: 'uuid' },
            optionId: { type: 'string', format: 'uuid' },
          },
        },
        ConversationMessage: {
          type: 'object',
          properties: {
            session_id: { type: 'string' },
            role: { type: 'string', example: 'user' },
            content: { type: 'string' },
            source: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        ConversationHistory: {
          type: 'object',
          properties: {
            raw: { type: 'array', items: { $ref: '#/components/schemas/ConversationMessage' } },
            formatted: { type: 'string' },
            isEmpty: { type: 'boolean' },
          },
        },
        SessionSummary: {
          type: 'object',
          properties: {
            session_id: { type: 'string' },
            started_at: { type: 'string', format: 'date-time' },
            message_count: { type: 'integer' },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.js'],
});

export default swaggerSpec;
