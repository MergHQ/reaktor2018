'use strict';
import * as bluebird from 'bluebird';
global.Promise = bluebird;

import RequestDelegator from './src/core/RequestDelegator';
import ObservationController from './src/controllers/ObservationController';
import ObservationDAO from './src/dao/ObservationDAO';

export async function observations(event, context, callback) {
  // Initialize data access object for observations.
  let observationDao = new ObservationDAO();
  observationDao.createTables();

  let requestDelegator = new RequestDelegator([new ObservationController(observationDao)]);
  let response = await new Promise((resolve, reject) => requestDelegator.delegateRequest(event).then(res => resolve(res)));

  callback(null, response);
}