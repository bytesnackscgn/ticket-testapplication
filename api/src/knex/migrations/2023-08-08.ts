import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	const uuidFunction = "(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))";
	await knex.schema.createTable('events', (table) => {
		table.string('id', 36).primary();
		table.timestamp('date', { precision: 6 });
		table.string('title', 256);
		table.string('city', 64);
	});
	
	await knex.schema.alterTable('events', function(table) {
		table.unique('id')
		table
      .string('id', 36)
      .notNullable()
      .defaultTo(knex.raw(uuidFunction))
      .alter();

	});
	  
	await knex.schema.createTable('tickets', (table) => {
		table.string('id', 36).primary();
		table.uuid('eventId').references('id').inTable('events'); // Add foreign key reference
		table.string('barcode', 8);
		table.string('firstName', 1024);
		table.string('lastName', 1024);
	});

	await knex.schema.alterTable('tickets', function(table) {
		table.unique('id');
		table
      .string('id', 36)
      .notNullable()
      .defaultTo(knex.raw(uuidFunction))
      .alter();
		table.unique('barcode');
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('tickets');
	await knex.schema.dropTableIfExists('events');
}