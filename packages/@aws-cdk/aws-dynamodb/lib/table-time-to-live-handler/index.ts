/* eslint-disable no-console */
import type { IsCompleteRequest, IsCompleteResponse, OnEventRequest, OnEventResponse } from '@aws-cdk/custom-resources/lib/provider-framework/types';
import { DynamoDB } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import { disableTimeToLive, enableTimeToLive, timeToLiveStatus } from './utils';

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
        // If the current TTL is different from the requested TTL the first step is always to disable the TTL.
        // Should the TTL not be undefined it will be enabled with the new attribute as this function will be
        // called again and the 'DISABLED' case will enable it.
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

    return { PhysicalResourceId: event.ResourceProperties.TableName };
  }

  return {};
}

export async function isCompleteHandler(event: IsCompleteRequest): Promise<IsCompleteResponse> {
  console.log('Event: %j', event);

  let { stable, correct } = await timeToLiveStatus(event);

  if (stable && !correct) {
    // If the ttl is stable but incorrect, we are in the second step of the enabled -> disabled -> enabled flow.
    // We therefore call the onEventHandler as the logic is the same as going from disabled to enabled,
    // which the handler supports. Afterwards we need to get the current ttl status as it should have changed.
    // This makes it possible to change the ttl attribute from a to b.
    await onEventHandler(event);
    ({ stable, correct } = await timeToLiveStatus(event));
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
      return { IsComplete: tableActive && stable && correct };
    case 'Delete':
      // There is nothing to delete, as time to live is connected to the table
      return { IsComplete: true };
  }
}
