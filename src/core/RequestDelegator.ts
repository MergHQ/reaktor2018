import Controller from '../controllers/IController';
import { APIGatewayEvent } from 'aws-lambda';

export default class RequestDelegator {
  private requestHandlerMap: Map<string, {
    get: Function | null,
    post: Function | null,
    delete: Function | null,
    patch: Function | null,
    put: Function | null
  }>

  constructor(controllers: Controller[]) {
    this.requestHandlerMap = new Map();
    controllers.forEach(ctrllr => {
      ctrllr.init(this);
    });
  }

  registerEndpoint(requestMethod: string, path: string, handler: Function) {
    let endpointHandlers = this.requestHandlerMap.get(path);
    if (endpointHandlers) {
      endpointHandlers[requestMethod.toLocaleLowerCase()] = handler;
    } else {
      this.requestHandlerMap.set(path,{
        get: null,
        post: null,
        delete: null,
        patch: null,
        put: null
      });
      this.registerEndpoint(requestMethod, path, handler);
    }
  }

  async delegateRequest(apiGatewayEvent: APIGatewayEvent) {
    let endpointHandlers = this.requestHandlerMap.get(apiGatewayEvent.resource);
    if (endpointHandlers) {
      let handler = endpointHandlers[apiGatewayEvent.httpMethod.toLocaleLowerCase()];
      if (handler) {
        return await handler(apiGatewayEvent);
      } else console.error('No request handler');
    } else console.error('No endpoint handler');

    return {
      statusCode: 404,
      body: 'Not found'
    }
  }
}