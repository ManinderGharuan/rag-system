
export const up = async (knex) => {
  await knex.schema.alterTable('nodes', (t) => {
    t.string('rag_source').nullable();  // links to a document source in pgvector
  });

  await knex.raw(`
    ALTER TABLE nodes
    DROP CONSTRAINT nodes_type_check
  `);
  await knex.raw(`
    ALTER TABLE nodes
    ADD CONSTRAINT nodes_type_check
    CHECK (type IN ('question', 'leaf', 'rag'))
  `);
};

export const down = async (knex) => {
  await knex.schema.alterTable('nodes', (t) => {
    t.dropColumn('rag_source');
  });
  await knex.raw(`
    ALTER TABLE nodes
    DROP CONSTRAINT nodes_type_check
  `);
  await knex.raw(`
    ALTER TABLE nodes
    ADD CONSTRAINT nodes_type_check
    CHECK (type IN ('question', 'leaf'))
  `);
};