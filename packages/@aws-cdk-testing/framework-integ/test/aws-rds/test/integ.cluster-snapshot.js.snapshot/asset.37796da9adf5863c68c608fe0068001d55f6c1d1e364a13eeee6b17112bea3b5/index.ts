/* eslint-disable no-console */
/// <reference path="../../../../../../../node_modules/aws-cdk-lib/custom-resources/lib/provider-framework/types.d.ts" />
import { RDS } from '@aws-sdk/client-rds'; // eslint-disable-line import/no-extraneous-dependencies

export async function onEventHandler(event: AWSCDKAsyncCustomResource.OnEventRequest): Promise<AWSCDKAsyncCustomResource.OnEventResponse> {
  console.log('Event: %j', event);

  const rds = new RDS();

  const physicalResourceId = `${event.ResourceProperties.DBClusterIdentifier}-${event.ResourceProperties.DBClusterIdentifier}`;

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    const data = await rds.createDBClusterSnapshot({
      DBClusterIdentifier: event.ResourceProperties.DBClusterIdentifier,
      DBClusterSnapshotIdentifier: event.ResourceProperties.DBClusterSnapshotIdentifier,
    });
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
    });
  }

  return {
    PhysicalResourceId: `${event.ResourceProperties.DBClusterIdentifier}-${event.ResourceProperties.DBClusterIdentifier}`,
  };
}

export async function isCompleteHandler(event: AWSCDKAsyncCustomResource.IsCompleteRequest): Promise<AWSCDKAsyncCustomResource.IsCompleteResponse> {
  console.log('Event: %j', event);

  const snapshotStatus = await tryGetClusterSnapshotStatus(event.ResourceProperties.DBClusterSnapshotIdentifier);

  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      return { IsComplete: snapshotStatus === 'available' };
    case 'Delete':
      return { IsComplete: snapshotStatus === undefined };
  }
}

async function tryGetClusterSnapshotStatus(identifier: string): Promise<string | undefined> {
  try {
    const rds = new RDS();
    const data = await rds.describeDBClusterSnapshots({
      DBClusterSnapshotIdentifier: identifier,
    });
    return data.DBClusterSnapshots?.[0].Status;
  } catch (err: any) {
    if (err.code === 'DBClusterSnapshotNotFoundFault') {
      return undefined;
    }
    throw err;
  }
}
