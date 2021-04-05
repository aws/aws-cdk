/* eslint-disable no-console */
import type { OnEventRequest } from '@aws-cdk/custom-resources/lib/provider-framework/types';
import { AWSError, DynamoDB } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
const dynamodb = new DynamoDB({ apiVersion: '2012-08-10' });


export async function disableTimeToLive(event: OnEventRequest) {
  try {
    await dynamodb.updateTimeToLive({
      TableName: event.ResourceProperties.TableName,
      TimeToLiveSpecification: {
        AttributeName: event.OldResourceProperties?.TimeToLiveAttribute,
        Enabled: false,
      },
    }).promise();
  } catch (err) {
    // Catch exception so we can try disabling again at a later point in time.
    // This is done to mimic the necessary behavior in the enable functionality.
    const awsError = err as AWSError;
    if (
      awsError.code === 'ValidationException' &&
      awsError.message === 'Time to live has been modified multiple times within a fixed interval'
    ) {
      console.log('Time to live has been modified multiple times within a fixed interval. Try again later.');
      return;
    }
    throw awsError;
  }
}

export async function enableTimeToLive(event: OnEventRequest) {
  try {
    await dynamodb.updateTimeToLive({
      TableName: event.ResourceProperties.TableName,
      TimeToLiveSpecification: {
        AttributeName: event.ResourceProperties.TimeToLiveAttribute,
        Enabled: true,
      },
    }).promise();
  } catch (err) {
    // Catch exception so we can try enabling again at a later point in time.
    // This is necessary if the ttl was just disabled as enabling is not available right away.
    // Allows the enabled -> disabled -> enabled flow to work.
    const awsError = err as AWSError;
    if (
      awsError.code === 'ValidationException' &&
      awsError.message === 'Time to live has been modified multiple times within a fixed interval'
    ) {
      console.log('Time to live has been modified multiple times within a fixed interval. Try again later.');
      return;
    }
    throw awsError;
  }
}

export async function timeToLiveStatus(event: OnEventRequest): Promise<{stable: boolean, correct: boolean}> {
  const currentTtl = await dynamodb.describeTimeToLive({
    TableName: event.ResourceProperties.TableName,
  }).promise();

  return {
    stable: (
      currentTtl.TimeToLiveDescription?.TimeToLiveStatus === 'ENABLED'
      || currentTtl.TimeToLiveDescription?.TimeToLiveStatus === 'DISABLED'
    ),
    correct: (
      currentTtl.TimeToLiveDescription?.AttributeName ===
      event.ResourceProperties.TimeToLiveAttribute
    ),
  };
}
