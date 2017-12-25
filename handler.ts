'use strict';
require('dotenv').config();
import RequestDelegator from './src/core/RequestDelegator';
import ObservationController from './src/controllers/ObservationController';
import ObservationDAO from './src/dao/ObservationDAO';

let observationDao = new ObservationDAO();
observationDao.createTables();

let requestDelegator = new RequestDelegator([new ObservationController(observationDao)]);

export async function observations(event, context, callback) {
  let response = await requestDelegator.delegateRequest(event);
  callback(null, response);
}