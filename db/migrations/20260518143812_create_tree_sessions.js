
export const up = async (knex) => {
  await knex.schema.createTable('tree_sessions', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.string('session_id').notNullable().index();
    t.uuid('tree_id').notNullable().references('id').inTable('trees').onDelete('CASCADE');
    t.uuid('current_node_id').notNullable().references('id').inTable('nodes');
    t.enum('status', ['active', 'completed', 'abandoned']).defaultTo('active');
    t.timestamp('started_at').defaultTo(knex.fn.now());
    t.timestamp('completed_at').nullable();
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('tree_session_steps', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.string('session_id').notNullable().index();
    t.uuid('node_id').notNullable().references('id').inTable('nodes');
    t.uuid('option_id').nullable().references('id').inTable('options');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('tree_session_steps');
  await knex.schema.dropTableIfExists('tree_sessions');
};