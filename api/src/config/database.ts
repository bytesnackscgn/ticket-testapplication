import { registerAs } from '@nestjs/config';
import knexConfig from './knex';

export default registerAs('database', () => ({
  ...knexConfig,
}));
