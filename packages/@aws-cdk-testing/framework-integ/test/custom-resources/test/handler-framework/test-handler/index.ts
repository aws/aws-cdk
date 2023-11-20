/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/// <reference path="../../../../../../../../node_modules/aws-cdk-lib/custom-resources/lib/provider-framework/types.d.ts" />
import { DynamoDB } from '@aws-sdk/client-dynamodb';

const dynamodb = new DynamoDB({});

export async function onEventHandler(event: AWSCDKAsyncCustomResource.OnEventRequest): Promise<AWSCDKAsyncCustomResource.OnEventResponse> {
  console.log('Event: %j', { ...event, ResponseURL: '...' });

  const tableName = event.ResourceProperties.TableName;
  const region = event.ResourceProperties.Region;
  const requestTime = event.ResourceProperties.RequestTime;

  switch (event.RequestType) {
    case 'Create': {
      await onCreate(tableName, requestTime);
      break;
    }
    case 'Update': {
      await onUpdate(tableName, requestTime);
      break;
    }
    case 'Delete': {
      await onDelete(tableName);
      break;
    }
  }

  return event.RequestType === 'Create' || event.RequestType === 'Update'
    ? { PhysicalResourceId: `${tableName}-${region}` }
    : {};
}

async function onCreate(tableName: string, requestTime: string) {
  await dynamodb.createTable({
    AttributeDefinitions: [
      { AttributeName: 'Request Time', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'Request Time', KeyType: 'HASH' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
    TableName: tableName,
  });
  await dynamodb.putItem({
    Item: {
      RequestTime: {
        S: requestTime,
      },
    },
    ReturnConsumedCapacity: 'TOTAL',
    TableName: tableName,
  });
}

async function onUpdate(tableName: string, requestTime: string) {
  await dynamodb.putItem({
    Item: {
      RequestTime: {
        S: requestTime,
      },
    },
    ReturnConsumedCapacity: 'TOTAL',
    TableName: tableName,
  });
}

async function onDelete(tableName: string) {
  await dynamodb.deleteTable({ TableName: tableName });
}
