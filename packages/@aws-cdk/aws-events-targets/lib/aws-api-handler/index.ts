/* eslint-disable no-console */
import AWS = require('aws-sdk');
import { AwsApiInput } from '../aws-api';

export async function handler(event: AwsApiInput) {
  console.log('Event: %j', event);
  console.log('AWS SDK VERSION: ' + (AWS as any).VERSION);

  const awsService = new (AWS as any)[event.service](event.apiVersion && { apiVersion: event.apiVersion });

  try {
    const response = await awsService[event.action](event.parameters).promise();
    console.log('Response: %j', response);
  } catch (e) {
    console.log(e);
    if (!event.catchErrorPattern || !new RegExp(event.catchErrorPattern).test(e.code)) {
      throw e;
    }
  }
}
