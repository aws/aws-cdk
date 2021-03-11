/* eslint-disable no-console */
import type { OnEventRequest } from '@aws-cdk/custom-resources/lib/provider-framework/types';
import { DynamoDB } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
const dynamodb = new DynamoDB({ apiVersion: '2012-08-10' });


export async function disableTimeToLive(event: OnEventRequest) {
  const ttl = await dynamodb.describeTimeToLive({ TableName: event.ResourceProperties.TableName }).promise();
  await dynamodb.updateTimeToLive({
    TableName: event.ResourceProperties.TableName,
    TimeToLiveSpecification: {
      AttributeName: ttl.TimeToLiveDescription?.AttributeName ?? '',
      Enabled: false,
    },
  }).promise();
}

export async function enableTimeToLive(event: OnEventRequest) {
  await dynamodb.updateTimeToLive({
    TableName: event.ResourceProperties.TableName,
    TimeToLiveSpecification: {
      AttributeName: event.ResourceProperties.TimeToLiveAttribute,
      Enabled: true,
    },
  }).promise();
}

export async function isTimeToLiveStable(event: OnEventRequest): Promise<boolean> {
  const currentTtl = await dynamodb.describeTimeToLive({
    TableName: event.ResourceProperties.TableName,
  }).promise();

  return !!(
    currentTtl.TimeToLiveDescription?.TimeToLiveStatus === 'ENABLED'
    || currentTtl.TimeToLiveDescription?.TimeToLiveStatus === 'DISABLED'
  );
}
