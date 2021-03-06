'use strict';
import * as bluebird from 'bluebird';
global.Promise = bluebird;

import ObservationDAO from './src/dao/ObservationDAO';
import { Observation, LocationObservations } from './src/models/Observation';

import { APIGatewayEvent, Context, Callback } from 'aws-lambda';

export async function getObservations(event: APIGatewayEvent, context: Context, callback: Callback) {
  // Initialize data access object for observations.
  let observationDao = new ObservationDAO();
  observationDao.createTables();

  let observations: Observation[];
  try {
    observations = await observationDao.findAll();
  } catch (e) {
    if (e) {
      console.error(e);
      return createResponse(500, null, e.message, callback);
    } else if (!e) {
      return createResponse(404, [], 'No results', callback);
    }
  }
  createResponse(200, observations, null, callback);
}

export async function addObservation(event: APIGatewayEvent, context: Context, callback: Callback) {
  // Initialize data access object for observations.
  let observationDao = new ObservationDAO();
  observationDao.createTables();

  if (event.body) {
    try {
      let obs = new Observation(JSON.parse(event.body));
      let observation = await observationDao.putOne(obs);
      createResponse(200, observation, null, callback);
    } catch (e) {
      console.error(e);
      createResponse(500, null, e.message, callback);
    }
  } else {
    createResponse(400, null, null, callback);
  }
}

export async function getLocationObservations(event: APIGatewayEvent, context: Context, callback: Callback) {
  // Initialize data access object for observations.
  let observationDao = new ObservationDAO();
  observationDao.createTables();

  let observations: Observation[] | LocationObservations;
  try {
    console.log(observations);
    observations = await observationDao.findByLocation(
      event.pathParameters.location, 
      (event.queryStringParameters && event.queryStringParameters.filterTo24h) ? true : false,
      (event.queryStringParameters && event.queryStringParameters.sortTempDesc) ? true : false
    );
  } catch (e) {
    if (e) {
      console.error(e);
      return createResponse(500, null, e.message, callback);
    } else if (!e) {
      return createResponse(404, [], 'No results', callback);
    }
  }
  createResponse(200, observations, null, callback);
}

function createResponse(status: number, body: Object | null, message: string | null, callback: Callback) {
  body = {
    ok: 200 === status,
    message,
    payload: body
  };

  return callback(null, {
    statusCode: status,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body)
  });
}
