import * as knex from 'knex';

export default interface DataAccessObject<T> {
  createTables(): void;
  findOne(term: any): Promise<T>;
  findAll(): Promise<T[]>;
  putOne(item: T): void;
  deleteOne(term: any): void;
  updateOne(term: any, item: T): void;
}