/* tslint:disable no-console */
import { DynamoDB } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import { execSync } from 'child_process';

let latestSdkInstalled = false;

function installLatestSdk(): void {
  console.log('Installing latest AWS SDK v2');
  // Both HOME and --prefix are needed here because /tmp is the only writable location
  execSync('HOME=/tmp npm install aws-sdk@2 --production --no-package-lock --no-save --prefix /tmp');
  latestSdkInstalled = true;
}

export async function onEventHandler(event: any): Promise<any> {
  console.log('Event: %j', event);

  // ReplicaUpdates has been introduced in v2.577.0
  // Node.js 12.x uses v2.536.0
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
          RegionName: event.ResourceProperties.Region
        }
      },
    ]
  }).promise();
  console.log('Update table: %j', data);

  return { PhysicalResourceId: event.ResourceProperties.Region };
}

export async function isCompleteHandler(event: any): Promise<any> {
  console.log('Event: %j', event);

  const dynamodb = new DynamoDB();

  const data = await dynamodb.describeTable({
    TableName: event.ResourceProperties.TableName
  }).promise();
  console.log('Describe table: %j', data);

  const replicas = (data.Table && data.Table.Replicas) || [];
  const regionReplica = replicas.find(r => r.RegionName === event.ResourceProperties.Region);

  switch (event.RequestType) {
    case 'Create':
      // Creation is complete when replica is reported as ACTIVE
      return { IsComplete: !!(regionReplica && regionReplica.ReplicaStatus === 'ACTIVE') };
    case 'Delete':
      // Deletion is complete when replica is gone
      return { IsComplete: regionReplica === undefined };
    case 'Update':
      // We do not expect to receive Update events
      return { IsComplete: true };
  }
}
