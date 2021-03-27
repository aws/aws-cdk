/* eslint-disable no-console */
import type { IsCompleteRequest, IsCompleteResponse, OnEventRequest, OnEventResponse } from '@aws-cdk/custom-resources/lib/provider-framework/types';
import { DynamoDB } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import { disableTimeToLive, enableTimeToLive, isTimeToLiveCorrect, isTimeToLiveStable } from './utils';

const dynamodb = new DynamoDB({ apiVersion: '2012-08-10' });

export async function onEventHandler(event: OnEventRequest): Promise<OnEventResponse> {
  console.log('Event: %j', event);

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    const currentTtl = await dynamodb.describeTimeToLive({
      TableName: event.ResourceProperties.TableName,
    }).promise();
    console.log('Describe time to live: %j', currentTtl);

    switch (currentTtl.TimeToLiveDescription?.TimeToLiveStatus) {
      case 'ENABLING':
        throw new Error('Can not change time to live while it is being enabled.');
      case 'DISABLING':
        throw new Error('Can not change time to live while it is being disabled.');
      case 'ENABLED':
        if (event.ResourceProperties.TimeToLiveAttribute !== currentTtl.TimeToLiveDescription.AttributeName) {
          await disableTimeToLive(event);
        }
        break;
      case 'DISABLED':
        if (event.ResourceProperties.TimeToLiveAttribute) {
          await enableTimeToLive(event);
        }
        break;
    }

    console.log('Update table: %j', event.ResourceProperties.TableName);
    return { PhysicalResourceId: event.ResourceProperties.TableName };
  }

  return {};
}

export async function isCompleteHandler(event: IsCompleteRequest): Promise<IsCompleteResponse> {
  console.log('Event: %j', event);

  if (await isTimeToLiveStable(event)) {
    await onEventHandler(event);
  }

  const data = await dynamodb.describeTable({
    TableName: event.ResourceProperties.TableName,
  }).promise();
  console.log('Describe table: %j', data);

  const tableActive = (data.Table?.TableStatus === 'ACTIVE');

  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      // Complete when time to live is fully functional
      return { IsComplete: tableActive && await isTimeToLiveStable(event) && await isTimeToLiveCorrect(event) };
    case 'Delete':
      // There is nothing to delete, as time to live is connected to the table
      return { IsComplete: true };
  }
}
