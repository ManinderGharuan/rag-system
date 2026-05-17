import { embeddingConfig } from '../../src/config/embeddingConfig.js';

export async function up(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS vector');

  await knex.schema.createTable('documents', (table) => {
    table.increments('id').primary();
    table.text('source').notNullable();
    table.integer('chunk_index').notNullable();
    table.text('content').notNullable();
    table.specificType('embedding', `vector(${embeddingConfig.dimensions})`).notNullable();
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.unique(['source', 'chunk_index']);
    table.index(['source'], 'documents_source_idx');
  });

  await knex.raw(`
    CREATE INDEX documents_embedding_idx
    ON documents
    USING ${embeddingConfig.indexType} (embedding vector_cosine_ops)
  `);
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('documents');
}
