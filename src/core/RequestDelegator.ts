import Controller from '../controllers/IController';
import { APIGatewayEvent } from 'aws-lambda';

export default class RequestDelegator {
  private requestHandlerMap: Map<string, {
    controller: Controller,
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

  registerEndpoint(requestMethod: string, path: string, handler: Function, controller: Controller) {
    let endpointHandlers = this.requestHandlerMap.get(path);
    if (endpointHandlers) {
      endpointHandlers[requestMethod.toLocaleLowerCase()] = handler;
    } else {
      this.requestHandlerMap.set(path,{
        controller,
        get: null,
        post: null,
        delete: null,
        patch: null,
        put: null
      });
      this.registerEndpoint(requestMethod, path, handler, controller);
    }
  }

  async delegateRequest(apiGatewayEvent: APIGatewayEvent) {
    let endpointHandlers = this.requestHandlerMap.get(apiGatewayEvent.resource);
    if (endpointHandlers) {
      let handler = endpointHandlers[apiGatewayEvent.httpMethod.toLocaleLowerCase()];
      if (handler) {
        // Bind the controllers scope to the function. This is required since
        // calling the function through a pointer to the class automatically initializes
        // *this* with a pointer to the class in the function scope, while calling the 
        // function without the class doesn't.
        let boundHandler = handler.bind(endpointHandlers.controller, apiGatewayEvent);
        return await boundHandler();
      } else console.error('No request handler');
    } else console.error('No endpoint handler');

    return {
      statusCode: 404,
      body: 'Not found'
    }
  }
}