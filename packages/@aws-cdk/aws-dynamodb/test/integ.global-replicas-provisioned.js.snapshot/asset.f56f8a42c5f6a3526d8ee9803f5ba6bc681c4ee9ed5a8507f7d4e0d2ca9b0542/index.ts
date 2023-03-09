/* eslint-disable no-console */
import type { IsCompleteRequest, IsCompleteResponse, OnEventRequest, OnEventResponse } from '@aws-cdk/custom-resources/lib/provider-framework/types';
import { DynamoDB } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export async function onEventHandler(event: OnEventRequest): Promise<OnEventResponse> {
  console.log('Event: %j', { ...event, ResponseURL: '...' });

  const dynamodb = new DynamoDB();

  const tableName = event.ResourceProperties.TableName;
  const region = event.ResourceProperties.Region;

  let updateTableAction: 'Create' | 'Update' | 'Delete' | undefined;
  if (event.RequestType === 'Create' || event.RequestType === 'Delete') {
    updateTableAction = event.RequestType;
  } else { // Update
    // There are two cases where an Update can happen:
    // 1. A table replacement. In that case, we need to create the replica in the new Table
    // (the replica for the "old" Table will be deleted when CFN issues a Delete event on the old physical resource id).
    // 2. A customer has changed one of the properties of the Custom Resource,
    // like 'waitForReplicationToFinish'. In that case, we don't have to do anything.
    // To differentiate the two cases, we make an API call to DynamoDB to check whether a replica already exists.
    const describeTableResult = await dynamodb.describeTable({
      TableName: tableName,
    }).promise();
    console.log('Describe table: %j', describeTableResult);
    const replicaExists = describeTableResult.Table?.Replicas?.some(replica => replica.RegionName === region);
    updateTableAction = replicaExists ? undefined : 'Create';
  }

  if (updateTableAction) {
    const data = await dynamodb.updateTable({
      TableName: tableName,
      ReplicaUpdates: [
        {
          [updateTableAction]: {
            RegionName: region,
          },
        },
      ],
    }).promise();
    console.log('Update table: %j', data);
  } else {
    console.log("Skipping updating Table, as a replica in '%s' already exists", region);
  }

  return event.RequestType === 'Create' || event.RequestType === 'Update'
    ? { PhysicalResourceId: `${tableName}-${region}` }
    : {};
}

export async function isCompleteHandler(event: IsCompleteRequest): Promise<IsCompleteResponse> {
  console.log('Event: %j', { ...event, ResponseURL: '...' });

  const dynamodb = new DynamoDB();

  const data = await dynamodb.describeTable({
    TableName: event.ResourceProperties.TableName,
  }).promise();
  console.log('Describe table: %j', data);

  const tableActive = data.Table?.TableStatus === 'ACTIVE';
  const replicas = data.Table?.Replicas ?? [];
  const regionReplica = replicas.find(r => r.RegionName === event.ResourceProperties.Region);
  const replicaActive = regionReplica?.ReplicaStatus === 'ACTIVE';
  const skipReplicationCompletedWait = event.ResourceProperties.SkipReplicationCompletedWait === 'true';

  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      // Complete when replica is reported as ACTIVE
      return { IsComplete: tableActive && (replicaActive || skipReplicationCompletedWait) };
    case 'Delete':
      // Complete when replica is gone
      return { IsComplete: tableActive && regionReplica === undefined };
  }
}
