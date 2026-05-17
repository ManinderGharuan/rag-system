
export async function up(knex) {
  await knex.schema.createTable('conversations', (table) => {
    table.increments('id').primary();
    table.string('session_id').notNullable().index();
    table.enum('role', ['user', 'assistant']).notNullable();
    table.text('content').notNullable();
    table.string('source').nullable();        // which doc was queried
    table.timestamps(true, true);
  });
};

export async function down(knex) {
  await knex.schema.dropTableIfExists('conversations');
};