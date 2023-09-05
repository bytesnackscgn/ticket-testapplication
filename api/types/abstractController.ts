//import type { Item } from './common';
import type { Query } from './query';

export interface AbstractController {
  createOne<T,O>(data: T): Promise<Partial<O>>;
  createMany<T,O>(data: T[]): Promise<Partial<O>[]>;

  readOne<T>(id: string, query?: Query): Promise<Partial<T>>;
  readByQuery<T>(query: Query): Promise<Partial<T>[]>;

  updateOne<T,O>(id: string, data: T): Promise<Partial<O>>;
  updateMany<T,O>(data: T[]): Promise<Partial<O>[]>;

  deleteOne(id: string): Promise<string[]>;
  deleteMany(ids: string[]): Promise<string[]>;
}
