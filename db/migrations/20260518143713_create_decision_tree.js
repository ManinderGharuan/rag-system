
export const up = async (knex) => {
  await knex.schema.createTable('trees', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.string('name').notNullable();
    t.text('description').nullable();
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('nodes', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.uuid('tree_id').notNullable().references('id').inTable('trees').onDelete('CASCADE');
    t.enum('type', ['question', 'leaf']).notNullable();
    t.text('content').notNullable();   // question text or final answer text
    t.boolean('is_root').defaultTo(false);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('options', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.uuid('tree_id').notNullable().references('id').inTable('trees').onDelete('CASCADE');
    t.uuid('node_id').notNullable().references('id').inTable('nodes').onDelete('CASCADE');
    t.uuid('next_node_id').nullable().references('id').inTable('nodes').onDelete('SET NULL');
    t.string('label').notNullable();   // text shown on the button
    t.integer('order').defaultTo(0);
    t.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('options');
  await knex.schema.dropTableIfExists('nodes');
  await knex.schema.dropTableIfExists('trees');
};