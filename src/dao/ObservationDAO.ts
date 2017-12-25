import * as knex from 'knex';
import DataAccessObject from './DataAccessObects';
import { Observation } from '../models/Observation';

export default class ObservationDAO implements DataAccessObject<Observation> {
  private database: knex;
  
  constructor() {
    this.database = knex({
      dialect: 'pg',
      connection: {
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        server: process.env.PG_SERVER,
        database: process.env.PG_DATABASE
      }
    });
  }

  async findOne(term: any): Promise<Observation> {
    return this.database.select('observations').where({ id: term }).limit(1);
  }

  async findAll(): Promise<Observation[]> {
    return this.database.select('*').from('observations')
      .then((results: any[]) => results.map(res => new Observation(res)));
  }

  async putOne(observation: Observation) {
    await this.database.insert(observation).into('observations');
  }

  deleteOne(term: any) {

  }

  updateOne(term: any, observation: Observation) {

  }


  async createTables() {
    await this.database.schema.createTableIfNotExists('observations', t => {
      t.increments('id').primary();
      t.integer('location').notNullable();
      t.float('temperature').notNullable();
      t.string('ip');
      t.timestamp('createdAt').defaultTo(this.database.fn.now());
    });
  }
}