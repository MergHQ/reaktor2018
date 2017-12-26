import Controller from './IController';
import RequestDelegator from '../core/RequestDelegator';
import { APIGatewayEvent } from 'aws-lambda';
import ObservationDAO from '../dao/ObservationDAO';
import { Observation } from '../models/Observation';

export default class ObservationController implements Controller {
  constructor(private dao: ObservationDAO) {}

  async findAll(event: APIGatewayEvent) {
    let observations = await this.dao.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(observations)
    };
  }

  async put(event: APIGatewayEvent) {
    let statusCode: number;
    if (event.body) {
      statusCode = 200;
      let obs = new Observation(JSON.parse(event.body));
      obs.ip = event.requestContext.identity.sourceIp;
      await this.dao.putOne(obs);
    } else {
      statusCode = 400;
    }
    
    return {
      statusCode,
      body: ''
    }
  }

  init(requestDelegator: RequestDelegator) {
    requestDelegator.registerEndpoint('get', '/observations', this.findAll, this);
    requestDelegator.registerEndpoint('put', '/observations', this.put, this);
  }
}