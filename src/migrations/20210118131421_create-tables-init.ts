import * as Knex from 'knex';
import { createTable, dropTable } from '../shared/helpers/knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  await createTable(knex, 'daily_price', table => {
    table.string('pair').notNullable();
    table.float('price').notNullable();
    table.float('mms').nullable();
    table.string('range').nullable();
    table.string('timestamp').notNullable();
  });

  await createTable(knex, 'system_notifications', table => {
    table.string('message').notNullable();
    table.jsonb('metadata').nullable();
    table.string('code').notNullable();
    table.boolean('fixed').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await dropTable(knex, 'daily_price');
  await dropTable(knex, 'system_notifications');
}
