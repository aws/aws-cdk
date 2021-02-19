/* eslint-disable no-console */
import type { IsCompleteRequest, IsCompleteResponse, OnEventRequest, OnEventResponse } from '@aws-cdk/custom-resources/lib/provider-framework/types';
import { DynamoDB } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export async function onEventHandler(event: OnEventRequest): Promise<OnEventResponse> {
  console.log('Event: %j', event);

  const updateTableAction = getUpdateTableAction(event);

  if (updateTableAction) {
    const dynamodb = new DynamoDB();

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
  }

  return { PhysicalResourceId: `${event.ResourceProperties.TableName}-${event.ResourceProperties.Region}` };
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

function getUpdateTableAction(event: OnEventRequest): 'Create' | 'Update' | 'Delete' | undefined {
  switch (event.RequestType) {
    case 'Create':
      return 'Create';
    case 'Update':
      // If it's a table replacement, create a replica in the "new" table
      if (event.OldResourceProperties?.TableName !== event.ResourceProperties.TableName) {
        return 'Create';
      }
      return;
    case 'Delete':
      // Process only deletes that have the new physical resource id format. This
      // is to prevent replica deletion when switching from the old format (region)
      // to the new format (table-region).
      if (event.PhysicalResourceId === `${event.ResourceProperties.TableName}-${event.ResourceProperties.Region}`) {
        return 'Delete';
      }
      return;
  }
}
