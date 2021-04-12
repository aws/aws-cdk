/* eslint-disable no-console */
import type { OnEventRequest } from '@aws-cdk/custom-resources/lib/provider-framework/types';
import { AWSError, CloudFormation, DynamoDB } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
const dynamodb = new DynamoDB({ apiVersion: '2012-08-10' });
const cloudFormation = new CloudFormation({ apiVersion: '2010-05-15' });


export async function disableTimeToLive(event: OnEventRequest) {
  await catchAwsError(async () => {
    console.log('Trying to disable time to live.');

    await dynamodb.updateTimeToLive({
      TableName: event.ResourceProperties.TableName,
      TimeToLiveSpecification: {
        AttributeName: event.OldResourceProperties?.TimeToLiveAttribute,
        Enabled: false,
      },
    }).promise();
  });
}

export async function enableTimeToLive(event: OnEventRequest) {
  await catchAwsError(async () => {
    console.log('Trying to enable time to live.');

    await dynamodb.updateTimeToLive({
      TableName: event.ResourceProperties.TableName,
      TimeToLiveSpecification: {
        AttributeName: event.ResourceProperties.TimeToLiveAttribute,
        Enabled: true,
      },
    }).promise();
  });
}

async function catchAwsError(func: () => Promise<void>) {
  try {
    await func();
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

  console.log('Describe time to live: %j', currentTtl);

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

export async function tableWillBeRemoved(event: OnEventRequest): Promise<boolean> {
  const stacks = (await cloudFormation.describeStacks({ StackName: event.StackId }).promise()).Stacks;

  const tableRemoval = await stacks?.map(async (stack): Promise<boolean> => {
    if ( stack.ChangeSetId === undefined ) {
      throw new Error('Can not describe changeset without id');
    }

    const changeset = await cloudFormation.describeChangeSet({ ChangeSetName: stack.ChangeSetId, StackName: event.StackId }).promise();

    return changeset.Changes?.map((change): boolean => {
      return change.Type === 'Resource'
        && change.ResourceChange?.ResourceType === 'AWS::DynamoDB::Table'
        && change.ResourceChange.PhysicalResourceId === event.PhysicalResourceId
        && change.ResourceChange.Action === 'Remove';
    }).reduce( (previousValue, currentValue) => previousValue || currentValue ) ?? false;

  }).reduce( (previousValue, currentValue) => previousValue || currentValue ) ?? false;

  console.log('Table will also be removed: %j', tableRemoval);
  return tableRemoval;
}
