/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import * as AWS from 'aws-sdk';
import { AwsApiInput } from '../aws-api';

export async function handler(event: AwsApiInput) {
  console.log('Event: %j', { ...event, ResponseURL: '...' });
  console.log('AWS SDK VERSION: ' + (AWS as any).VERSION);

  const awsService = new (AWS as any)[event.service](event.apiVersion && { apiVersion: event.apiVersion });

  try {
    const response = await awsService[event.action](event.parameters).promise();
    console.log('Response: %j', response);
  } catch (e: any) {
    console.log(e);
    if (!event.catchErrorPattern || !new RegExp(event.catchErrorPattern).test(e.code)) {
      throw e;
    }
  }
}
