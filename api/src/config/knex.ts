import * as path from 'path';

const dbBasePath = process.env?.DB_ENV === 'migration' ? `../../database/` : `../../../database/`;

export default {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, dbBasePath, process.env.DATABASE_FILE || 'db.sqlite'),
  },
  migrations: {
    directory: '../knex/migrations/',
  },
  seeds: {
    directory: '../knex/seeds/',
  },
  timezone: 'UTC',
};