'use strict';
require('dotenv').config();
import RequestDelegator from './src/core/RequestDelegator';
import ObservationController from './src/controllers/ObservationController';
import ObservationDAO from './src/dao/ObservationDAO';

export async function observations(event, context, callback) {
  let observationDao = new ObservationDAO();
  await observationDao.createTables();
  let requestDelegator = new RequestDelegator([new ObservationController(observationDao)]);
  let response = await requestDelegator.delegateRequest(event);
  callback(null, response);
}