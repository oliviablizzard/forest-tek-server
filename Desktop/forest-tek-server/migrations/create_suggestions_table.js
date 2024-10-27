export const up = async (knex) => {
    await knex.schema.createTable('suggestions', (table) => {
        table.increments('id').primary();
        table.string('program_name').notNullable();
        table.string('institution_name').notNullable();
        table.string('location').notNullable();
        table.text('message').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

export const down = async (knex) => {
    await knex.schema.dropTableIfExists('suggestions');
};