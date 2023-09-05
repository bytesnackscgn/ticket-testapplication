import { Module } from '@nestjs/common';
import knex from 'knex';
import type{Knex} from 'knex';
import knexConfig from '../config/knex';

@Module({
  providers: [
    {
      provide: 'DB',
      useFactory: async (): Promise<Knex> => {
        const dbClient = knex(knexConfig);
		return dbClient;
      },

    },
  ],
  exports: ['DB'],
})
export class KnexModule {}
