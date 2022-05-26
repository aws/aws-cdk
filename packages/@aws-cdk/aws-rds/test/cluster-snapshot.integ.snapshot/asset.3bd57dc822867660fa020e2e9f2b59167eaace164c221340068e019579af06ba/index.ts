/* eslint-disable no-console */
import type { IsCompleteRequest, IsCompleteResponse, OnEventRequest, OnEventResponse } from '@aws-cdk/custom-resources/lib/provider-framework/types';
import { RDS } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export async function onEventHandler(event: OnEventRequest): Promise<OnEventResponse> {
  console.log('Event: %j', event);

  const rds = new RDS();

  const physicalResourceId = `${event.ResourceProperties.DBClusterIdentifier}-${event.ResourceProperties.DBClusterIdentifier}`;

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    const data = await rds.createDBClusterSnapshot({
      DBClusterIdentifier: event.ResourceProperties.DBClusterIdentifier,
      DBClusterSnapshotIdentifier: event.ResourceProperties.DBClusterSnapshotIdentifier,
    }).promise();
    return {
      PhysicalResourceId: physicalResourceId,
      Data: {
        DBClusterSnapshotArn: data.DBClusterSnapshot?.DBClusterSnapshotArn,
      },
    };
  }

  if (event.RequestType === 'Delete') {
    await rds.deleteDBClusterSnapshot({
      DBClusterSnapshotIdentifier: event.ResourceProperties.DBClusterSnapshotIdentifier,
    }).promise();
  }

  return {
    PhysicalResourceId: `${event.ResourceProperties.DBClusterIdentifier}-${event.ResourceProperties.DBClusterIdentifier}`,
  };
}

export async function isCompleteHandler(event: IsCompleteRequest): Promise<IsCompleteResponse> {
  console.log('Event: %j', event);

  const rds = new RDS();

  const data = await rds.describeDBClusterSnapshots({
    DBClusterSnapshotIdentifier: event.ResourceProperties.DBClusterSnapshotIdentifier,
  }).promise();

  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      return { IsComplete: data.DBClusterSnapshots?.[0].Status === 'available' };
    case 'Delete':
      return { IsComplete: data.DBClusterSnapshots?.length === 0 };
  }
}
