import DataAccessObject from './DataAccessObject';
import { Observation, Location } from '../models/Observation';
import * as vogels from 'vogels';
import * as joi from 'joi';

export default class ObservationDAO implements DataAccessObject<Observation> {
  private model: any;
  private vogels: any;
  constructor() {
  }

  findOne(term: any): Promise<Observation> {
    return new Promise<Observation>((resolve, reject) => {
      this.model.get(term, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(new Observation(result.attrs));
        }
      });
    });
  }

  findByLocation(location: string, filterTo24h: boolean = false, sortTempDesc: boolean = false): Promise<Observation[]> {
    return new Promise<Observation[]>((resolve, reject) => {
      let query = this.model
        .scan()
        .where('location')
        .equals(Location[location])

        if (filterTo24h) {
          query = query
            .where('createdAt')
              .gte(
                new Date(Date.now() - (24 * 60 * 60 * 1000)).toISOString());
        }

        query.exec((err, result) => {
          if (err || !result) {
            reject(err);
          } else {
            if (sortTempDesc) {
              // TODO: Sort with DynamoDB
              result.Items.sort((a, b) => a.temperature - b.temperature);
            }
            resolve(result.Items.map(item => new Observation(item.attrs)));
          }
        });
    });
  }

  findAll(): Promise<Observation[]> {
    return new Promise<Observation[]>((resolve, reject) => {
      this.model
        .scan()
        .loadAll()
        .exec((err, result) => {
          if (err || !result) {
            reject(err);
          } else {
            resolve(result.Items.map(item => new Observation(item.attrs)));
          }
        });
    });
  }

  putOne(observation: Observation) {
    return new Promise((resolve, reject) => {
      this.model.create(observation, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.attrs);
        }
      });
    });
  }

  deleteOne(term: any) {

  }

  updateOne(term: any, observation: Observation) {

  }

  createTables() {
    console.log('Creating model for observations...');
    vogels.AWS.config.update({ region: 'eu-central-1' });
    this.model = vogels.define('observations', {
      hashKey: 'id',
      timestamps: true,
      schema: {
        id: vogels.types.uuid(),
        location: joi.number(),
        temperature: joi.number(),
      }
    });
  }
}