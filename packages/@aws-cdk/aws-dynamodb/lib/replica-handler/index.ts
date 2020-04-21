/* tslint:disable no-console */
import { IsCompleteRequest, IsCompleteResponse, OnEventRequest, OnEventResponse } from '@aws-cdk/custom-resources/lib/provider-framework/types';
import { DynamoDB } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import { execSync } from 'child_process';

let latestSdkInstalled = false;

function installLatestSdk(): void {
  console.log('Installing latest AWS SDK v2');
  // Both HOME and --prefix are needed here because /tmp is the only writable location
  execSync('HOME=/tmp npm install aws-sdk@2 --production --no-package-lock --no-save --prefix /tmp');
  latestSdkInstalled = true;
}

export async function onEventHandler(event: OnEventRequest): Promise<OnEventResponse> {
  console.log('Event: %j', event);

  /**
   * Process only Create and Delete requests. We shouldn't receive any
   * update request and in case we do there is nothing to update.
   */
  if (event.RequestType === 'Create' || event.RequestType === 'Delete') {
    // ReplicaUpdates has been introduced in v2.577.0
    // Node.js 12.x currently uses v2.536.0
    if (!latestSdkInstalled && !process.env.USE_NORMAL_SDK) {
      installLatestSdk();
    }

    let AWS: any;
    if (process.env.USE_NORMAL_SDK) { // For tests only
      AWS = require('aws-sdk'); // eslint-disable-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies
    } else {
      AWS = require('/tmp/node_modules/aws-sdk'); // eslint-disable-line @typescript-eslint/no-require-imports
    }

    const dynamodb = new AWS.DynamoDB() as DynamoDB;

    const data = await dynamodb.updateTable({
      TableName: event.ResourceProperties.TableName,
      ReplicaUpdates: [
        {
          [event.RequestType]: {
            RegionName: event.ResourceProperties.Region,
          },
        },
      ],
    }).promise();
    console.log('Update table: %j', data);
  }

  return { PhysicalResourceId: event.ResourceProperties.Region };
}

export async function isCompleteHandler(event: IsCompleteRequest): Promise<IsCompleteResponse> {
  console.log('Event: %j', event);

  const dynamodb = new DynamoDB();

  const data = await dynamodb.describeTable({
    TableName: event.ResourceProperties.TableName,
  }).promise();
  console.log('Describe table: %j', data);

  const tableActive = !!(data.Table?.TableStatus === 'ACTIVE');
  const replicas = data.Table?.Replicas ?? [];
  const regionReplica = replicas.find(r => r.RegionName === event.ResourceProperties.Region);
  const replicaActive = !!(regionReplica?.ReplicaStatus === 'ACTIVE');

  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      // Complete when replica is reported as ACTIVE
      return { IsComplete: tableActive && replicaActive };
    case 'Delete':
      // Complete when replica is gone
      return { IsComplete: tableActive && regionReplica === undefined };
  }
}
