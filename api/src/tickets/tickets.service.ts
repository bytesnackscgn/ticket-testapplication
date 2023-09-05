import type { Knex } from 'knex';
import type { Tickets, Query } from '../../types';
import { Injectable, Inject } from '@nestjs/common';
import { CreateTicketDto, CreateManyTicketsDto } from './dto/create-ticket.dto';
import { UpdateTicketDto, UpdateManyTicketsDto } from './dto/update-ticket.dto';
import { ItemService } from '../item/item.service';

@Injectable()
export class TicketsService extends ItemService {
  constructor(@Inject('DB') public dbClient) {
    super('tickets', dbClient);
  }

  async createOne<T, O>(data: T): Promise<Partial<O>> {
    const payload = data as CreateTicketDto;
    return await super.createOne(payload);
  }

  async createMany<CreateTicketDto, Tickets>(
    data: CreateTicketDto[],
  ): Promise<Partial<Tickets>[]> {
    return await super.createMany(data);
  }

  async readOne<T>(id: string): Promise<Partial<T>> {
    return (await super.readOne(id)) as Partial<T>;
  }

  async readByQuery<T>(query: Query): Promise<Partial<T>[]> {
    return (await super.readByQuery(query)) as Partial<T>[];
  }

  async updateOne<T, O>(id: string, data: T): Promise<Partial<O>> {
    const payload = data as UpdateTicketDto;
    return (await super.updateOne<UpdateTicketDto, Tickets>(
      id,
      payload,
    )) as Partial<O>;
  }

  async updateMany<T, O>(data: T[]): Promise<Partial<O>[]> {
    const payload = data as UpdateTicketDto[];
    return (await super.updateMany(payload)) as Partial<O>[];
  }

  async deleteOne(id: string): Promise<string[]> {
    return await super.deleteOne(id);
  }

  async deleteMany(ids: string[]): Promise<string[]> {
    return await super.deleteMany(ids);
  }
}
