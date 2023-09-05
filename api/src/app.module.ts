import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ItemService } from './item/item.service';
import { EventsModule } from './events/events.module';
import { EventsService } from './events/events.service';
import { EventsController } from './events/events.controller';
import { TicketsModule } from './tickets/tickets.module';
import { TicketsService } from './tickets/tickets.service';
import { TicketsController } from './tickets/tickets.controller';
import { KnexModule } from './knex/knex.module';
import databaseConfig from './config/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
	KnexModule,
    //EventsModule,
    //TicketsModule,
	ServeStaticModule.forRoot({
		rootPath: join(__dirname, '../../../app/dist'),
	}),
  ],
  controllers: [AppController, TicketsController, EventsController],
  providers: [AppService, TicketsService, EventsService],
})
export class AppModule {}
