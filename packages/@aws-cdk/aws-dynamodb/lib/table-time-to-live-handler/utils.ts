/* eslint-disable no-console */
import type { OnEventRequest } from '@aws-cdk/custom-resources/lib/provider-framework/types';
import { AWSError, DynamoDB } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
const dynamodb = new DynamoDB({ apiVersion: '2012-08-10' });


export async function disableTimeToLive(event: OnEventRequest) {
  await dynamodb.updateTimeToLive({
    TableName: event.ResourceProperties.TableName,
    TimeToLiveSpecification: {
      AttributeName: event.OldResourceProperties?.TimeToLiveAttribute,
      Enabled: false,
    },
  }).promise();
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

export async function isTimeToLiveStable(event: OnEventRequest): Promise<boolean> {
  const currentTtl = await dynamodb.describeTimeToLive({
    TableName: event.ResourceProperties.TableName,
  }).promise();

  return (
    currentTtl.TimeToLiveDescription?.TimeToLiveStatus === 'ENABLED'
    || currentTtl.TimeToLiveDescription?.TimeToLiveStatus === 'DISABLED'
  );
}

export async function isTimeToLiveCorrect(event: OnEventRequest): Promise<boolean> {
  const currentTtl = await dynamodb.describeTimeToLive({
    TableName: event.ResourceProperties.TableName,
  }).promise();

  return (
    currentTtl.TimeToLiveDescription?.AttributeName ===
    event.ResourceProperties.TimeToLiveAttribute
  );
}
