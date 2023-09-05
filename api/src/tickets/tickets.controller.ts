import {
  Controller,
  Query,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import type { Tickets, Query as FilterQuery } from '../../types';
import { CustomError } from '../lib/errors';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    try {
      return this.ticketsService.createOne<CreateTicketDto, Tickets>(
        createTicketDto,
      );
    } catch (e) {
      throw new CustomError(500, e.message);
    }
  }

  @Get()
  findAll(@Query() query) {
    try {
      const customQuery: FilterQuery = {};
      if (query.fields) {
        customQuery.fields = JSON.parse(query.fields);
      }

      if (query.sort) {
        customQuery.sort = query.sort;
      }

      if (query.filter) {
        customQuery.filter = JSON.parse(query.filter);
      }

      if (query.limit) {
        customQuery.limit = Number.parseInt(query.limit);
      }

      if (query.offset) {
        customQuery.offset = Number.parseInt(query.offset);
      }

      if (query.page) {
        customQuery.page = query.page;
      }
      return this.ticketsService.readByQuery<Tickets>(customQuery);
    } catch (e) {
      throw new CustomError(500, e.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.ticketsService.readOne<Tickets>(id);
    } catch (e) {
      throw new CustomError(500, e.message);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateTicketDto) {
    try {
      return this.ticketsService.updateOne<UpdateTicketDto, Tickets>(
        updateEventDto.id,
        updateEventDto,
      );
    } catch (e) {
      throw new CustomError(500, e.message);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.ticketsService.deleteOne(id);
    } catch (e) {
      throw new CustomError(500, e.message);
    }
  }
}
