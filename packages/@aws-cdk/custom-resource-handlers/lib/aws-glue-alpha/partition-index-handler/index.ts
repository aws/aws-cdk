/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies*/
import { Glue } from '@aws-sdk/client-glue';
import {
  IsCompleteRequest,
  OnEventRequest,
  OnEventResponse,
  IsCompleteResponse,
} from 'aws-cdk-lib/custom-resources/lib/provider-framework/types';

const glue = new Glue({});

export async function onEventHandler(event: OnEventRequest): Promise<OnEventResponse> {
  console.log(`Event: ${JSON.stringify({ ...event, ResponseURL: '...' })}`);

  const databaseName = event.ResourceProperties.DatabaseName;
  const tableName = event.ResourceProperties.TableName;
  const indexName = event.ResourceProperties.IndexName;

  const requestType = event.RequestType;

  switch (requestType) {
    case 'Create':
    case 'Update':
      await onUpdate(event);
      break;
    case 'Delete':
      await onDelete(event);
      break;
  }

  return requestType === 'Create' || requestType === 'Update'
    ? { PhysicalResourceId: `${databaseName}-${tableName}-${indexName}` }
    : {};
}

export async function isCompleteHandler(event: IsCompleteRequest): Promise<IsCompleteResponse> {
  console.log(`Event: ${JSON.stringify({ ...event, ResponseURL: '...' })}`);

  const tableName = event.ResourceProperties.TableName;
  const databaseName = event.ResourceProperties.DatabaseName;
  const indexName = event.ResourceProperties.IndexName;

  const data = await glue.getPartitionIndexes({
    TableName: tableName,
    DatabaseName: databaseName,
  });

  console.log(`Get partition indexes: ${JSON.stringify(data)}`);

  const partitionIndexes = data.PartitionIndexDescriptorList ?? [];
  const targetPartitionIndex = partitionIndexes.find(partitionIndex => partitionIndex.IndexName === indexName);
  const partitionIndexActive = targetPartitionIndex?.IndexStatus === 'ACTIVE';

  // switch (event.RequestType) {
  //   case 'Create':
  //   case 'Update':
  //     // complete when partition index is ACTIVE
  //     return { IsComplete: partitionIndexActive };
  //   case 'Delete':
  //     break;
  // }

  // complete when partition index is ACTIVE
  return { IsComplete: partitionIndexActive };
}

async function onUpdate(event: OnEventRequest) {
  const tableName = event.ResourceProperties.TableName;
  const databaseName = event.ResourceProperties.DatabaseName;
  const indexName = event.ResourceProperties.IndexName;
  const keys = event.ResourceProperties.Keys;

  const data = await glue.createPartitionIndex({
    TableName: tableName,
    DatabaseName: databaseName,
    PartitionIndex: {
      IndexName: indexName,
      Keys: keys,
    },
  });

  console.log(`Create partition index: ${JSON.stringify(data)}`);
}

async function onDelete(event: OnEventRequest) {
  const tableName = event.ResourceProperties.TableName;
  const databaseName = event.ResourceProperties.DatabaseName;
  const indexName = event.ResourceProperties.IndexName;

  const data = await glue.deletePartitionIndex({
    TableName: tableName,
    DatabaseName: databaseName,
    IndexName: indexName,
  });

  console.log(`Delete partition index: ${JSON.stringify(data)}`);
}
