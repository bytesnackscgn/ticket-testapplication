import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';

@Module({
	imports: [],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
