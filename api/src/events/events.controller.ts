import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import type { Events, Query as FilterQuery } from '../../types';
import { CustomError } from '../lib/errors';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    try {
      return this.eventsService.createOne<CreateEventDto, Events>(
        createEventDto,
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
      return this.eventsService.readByQuery<Events>(customQuery);
    } catch (e) {
      throw new CustomError(500, e.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.eventsService.readOne<Events>(id);
    } catch (e) {
      throw new CustomError(500, e.message);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    try {
      return this.eventsService.updateOne<UpdateEventDto, Events>(
        id,
        updateEventDto,
      );
    } catch (e) {
      throw new CustomError(500, e.message);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.eventsService.deleteOne(id);
    } catch (e) {
      throw new CustomError(500, e.message);
    }
  }
}
