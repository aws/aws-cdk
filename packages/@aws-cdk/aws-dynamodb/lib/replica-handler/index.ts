/* eslint-disable no-console */
import type { IsCompleteRequest, IsCompleteResponse, OnEventRequest, OnEventResponse } from '@aws-cdk/custom-resources/lib/provider-framework/types';
import { DynamoDB } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export async function onEventHandler(event: OnEventRequest): Promise<OnEventResponse> {
  console.log('Event: %j', event);

  const dynamodb = new DynamoDB();

  let updateTableAction: 'Create' | 'Update' | 'Delete';
  if (event.RequestType === 'Create' || event.RequestType === 'Delete') {
    updateTableAction = event.RequestType;
  } else { // Update
    // This can only be a table replacement so we create a replica
    // in the new table. The replica for the "old" table will be
    // deleted when CF issues a Delete event on the old physical
    // resource id.
    updateTableAction = 'Create';
  }

  const data = await dynamodb.updateTable({
    TableName: event.ResourceProperties.TableName,
    ReplicaUpdates: [
      {
        [updateTableAction]: {
          RegionName: event.ResourceProperties.Region,
        },
      },
    ],
  }).promise();
  console.log('Update table: %j', data);

  return event.RequestType === 'Create' || event.RequestType === 'Update'
    ? { PhysicalResourceId: `${event.ResourceProperties.TableName}-${event.ResourceProperties.Region}` }
    : {};
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
