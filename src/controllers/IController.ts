import RequestDelegator from '../core/RequestDelegator';

export default interface Controller {
  init(registerEndponint: RequestDelegator): void;
}