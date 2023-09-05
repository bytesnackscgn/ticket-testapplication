import type { Knex } from 'knex';
import type { Events, Query } from '../../types';
import { Injectable, Inject } from '@nestjs/common';
import { CreateEventDto, CreateManyEventsDto } from './dto/create-event.dto';
import { UpdateEventDto, UpdateManyEventsDto } from './dto/update-event.dto';
import { ItemService } from '../item/item.service';

@Injectable()
export class EventsService extends ItemService {
  constructor(@Inject('DB') public dbClient) {
    super('events', dbClient);
  }

  async createOne<T, O>(data: T): Promise<Partial<O>> {
    const payload = data as CreateEventDto;
    return await super.createOne(payload);
  }

  async createMany<T, O>(data: T[]): Promise<Partial<O>[]> {
    const payload = data as CreateEventDto[];
    return await super.createMany(payload);
  }

  async readOne<T>(id: string): Promise<Partial<T>> {
    return (await super.readOne(id)) as Partial<T>;
  }

  async readByQuery<T>(query: Query): Promise<Partial<T>[]> {
    return (await super.readByQuery(query)) as Partial<T>[];
  }

  async updateOne<T, O>(id: string, data: T): Promise<Partial<O>> {
    const payload = data as UpdateEventDto;
    return (await super.updateOne<UpdateEventDto, Events>(
      id,
      payload,
    )) as Partial<O>;
  }

  async updateMany<T, O>(data: T[]): Promise<Partial<O>[]> {
    const payload = data as UpdateEventDto[];
    return (await super.updateMany(payload)) as Partial<O>[];
  }

  async deleteOne(id: string): Promise<string[]> {
    return await super.deleteOne(id);
  }

  async deleteMany(ids: string[]): Promise<string[]> {
    return await super.deleteMany(ids);
  }
}
