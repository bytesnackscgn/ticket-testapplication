import { Injectable, Inject } from '@nestjs/common';
import type { Knex } from 'knex';
import type { Query, AbstractController, /*Item as AnyItem*/ } from '../../types';
import { FilteringError, CustomError, NotFoundItemError } from '../lib/errors/';
import { getFilter } from '../lib/filter';
import { classToPlain } from 'class-transformer';

@Injectable()
export class ItemService implements AbstractController
{
  constructor(
    public collection: string,
	public dbClient: Knex
  ) {

  }
	
  async createOne<T, O>(data: T): Promise<Partial<O>> {  
    const newItem: Partial<O> = await this.dbClient.transaction(async (trx) => {
      try {
		delete data['id'];
        const result = await trx
          .insert(data)
          .into(this.collection)
          .returning('*')
          .then((result) => result[0]);

        return result as Partial<O>;
      } catch (err) {
        throw new CustomError(500, err.message);
      }
    });

    return newItem;
  }

  /**
   * Create multiple new items at once. Inserts all provided records sequentially wrapped in a transaction.
   * Returns all new items
   */
  async createMany<T,O>(data: T[]): Promise<Partial<O>[]> {
    const newItems: Partial<O>[] = await this.dbClient.transaction(async (trx) => {
      const items: Partial<O>[] = [];
      for (const item of data) {
        const newItem: Partial<O> = await this.createOne(item);
        items.push(newItem);
      }

      return items as Partial<O>[];
    });

    return newItems;
  }

  /**
   * Get single item by primary key
   */
  async readOne<T>(
    id: string,
    //query: Query = {},
  ): Promise<Partial<T>> {
    try {
      /*query.filter = {
        id: {
          _eq: id,
        },
      };*/
      const results: Partial<T>[] = await this.dbClient.transaction(async (trx) => {
        const knexQuery = trx(this.collection);
        knexQuery.select('*').where('id', id);
        return await knexQuery;
      });

      if (results.length === 1) {
        return results[0];
      }

      if (results.length === 0) {
        throw new NotFoundItemError(this.collection, id);
      }

      if (results.length > 1) {
        throw new FilteringError(this.collection, id);
      }
    } catch (err) {
      throw new CustomError(500, err.message);
    }
  }

   /**
   * Get items by query
   */
   async readByQuery<T>(query: Query): Promise<Partial<T>[]> {
    try {
      const items: Partial<T>[] = await this.dbClient.transaction(async (trx) => {
        let knexQuery = trx(this.collection);

        // Select specific fields if provided
        if (query.fields) {
          knexQuery = knexQuery.select(query.fields);
        }
		
        // Apply filter if provided
        if (query.filter && typeof query.filter === 'object') {
          const { _and, _or, ...filters } = query.filter;

          // Apply regular filters
          for (const key in filters) {
            if (Object.prototype.hasOwnProperty.call(filters, key)) {
              const value = filters[key];
              if (typeof value === 'object' && !Array.isArray(value)) {
                for (const operator in value) {
                  if (Object.prototype.hasOwnProperty.call(value, operator)) {
                    const filterFn = getFilter(key, operator, value[operator]);
                    if (filterFn) {
                      knexQuery = filterFn(knexQuery);
                    }
                  }
                }
              } else {
                knexQuery = knexQuery.where(key, value);
              }
            }
          }

          // Apply logical operators '_and' and '_or'
          if (_and && Array.isArray(_and) && _and.length > 0) {
            for (const andFilter of _and) {
              for (const key in andFilter) {
                if (Object.prototype.hasOwnProperty.call(andFilter, key)) {
                  const value = andFilter[key];
                  if (typeof value === 'object' && !Array.isArray(value)) {
                    for (const operator in value) {
                      if (
                        Object.prototype.hasOwnProperty.call(value, operator)
                      ) {
                        const filterFn = getFilter(
                          key,
                          operator,
                          value[operator],
                        );
                        if (filterFn) {
                          knexQuery = filterFn(knexQuery);
                        }
                      }
                    }
                  } else {
                    knexQuery = knexQuery.andWhere(key, value);
                  }
                }
              }
            }
          }

          if (_or && Array.isArray(_or) && _or.length > 0) {
            for (const orFilter of _or) {
              for (const key in orFilter) {
                if (Object.prototype.hasOwnProperty.call(orFilter, key)) {
                  const value = orFilter[key];
                  if (typeof value === 'object' && !Array.isArray(value)) {
                    for (const operator in value) {
                      if (
                        Object.prototype.hasOwnProperty.call(value, operator)
                      ) {
                        const filterFn = getFilter(
                          key,
                          operator,
                          value[operator],
                        );
                        if (filterFn) {
                          knexQuery = filterFn(knexQuery);
                        }
                      }
                    }
                  } else {
                    knexQuery = knexQuery.orWhere(key, value);
                  }
                }
              }
            }
          }
        }
		
        // Apply sorting if provided
        if (query.sort && typeof query.sort === 'string') {
          const sortOrder = query.sort.startsWith('-') ? 'desc' : 'asc';
          const sortField = query.sort.replace(/^-/, '');
          knexQuery = knexQuery.orderBy(sortField, sortOrder);
        }

        // Apply limit if provided
        if (query.limit && Number.isInteger(query.limit) && query.limit > 0) {
          knexQuery = knexQuery.limit(query.limit);
        }

        // Execute the query and return the result
        const result = await knexQuery;

        return result as T[];
      });

      return items;
    } catch (err) {
      throw new CustomError(500, err.message);
    }
  }
  

  /**
   * Update a single item by primary key
   */
  async updateOne<T,O>(id: string, data: T): Promise<Partial<O>> {
    try {
      const updatedItem: Partial<O> = await this.dbClient.transaction(async (trx) => {
		delete data['id'];
        const result = await trx(this.collection)
          .update(data)
          .where('id', id)
          .returning('*')
          .then((result) => result[0]);

        return result as Partial<O>;
      });

      return updatedItem;
    } catch (err) {
      throw new CustomError(500, err.message);
    }
  }

  /**
   * Update many items
   */
  async updateMany<T, O>(data: T[]): Promise<Partial<O>[]> {
    try {
		const updatedItems = await this.dbClient.transaction(async (trx) => {
			const itemPromises = data.map((item) => {
				const payload = classToPlain(item);
				return this.updateOne(payload.id, item);
			});
			return await Promise.all(itemPromises);
		});
	  
      return updatedItems;
    } catch (err) {
      throw new CustomError(500, err.message);
    }
  }

  /**
   * Delete a single item by primary key
   */
  async deleteOne(id: string): Promise<string[]> {
    try {
		const deleteCount: number = await this.dbClient.transaction(async (trx) => {
		  return await trx(this.collection).where('id', id).del('id',{ includeTriggerModifications: true });
		}) as number;
	
		if (deleteCount === 0) {
		  throw new Error(`Item with ID ${id} not found`);
		}
	
		// Return the deleted ID
		return [id];
	  } catch (error) {
		// Handle and log the error
		console.error(`Error deleting item with ID: ${id}`, error);
		throw new Error(`Failed to delete item with ID ${id}`);
	  }
  }

  /**
   * Delete multiple items by primary key
   */
  async deleteMany(ids: string[]): Promise<string[]> {
    try {
		const deleteCount: number = await this.dbClient.transaction(async (trx) => {
		  return await trx(this.collection).whereIn('id', ids).del();
		}) as number;
	
		if (deleteCount !== ids.length) {
		  console.warn(`Some items with the following IDs were not found and not deleted: ${ids}`);
		}
		
		return ids;
	  } catch (error) {
		console.error(`Error deleting items with IDs: ${ids.join(', ')}`, error);
		throw new Error(`Failed to delete items with IDs: ${ids.join(', ')}`);
	  }
  }
}
