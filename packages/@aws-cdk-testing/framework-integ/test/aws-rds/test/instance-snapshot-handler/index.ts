/* eslint-disable no-console */
/// <reference path="../../../../../../../node_modules/aws-cdk-lib/custom-resources/lib/provider-framework/types.d.ts" />
import { RDS } from '@aws-sdk/client-rds'; // eslint-disable-line import/no-extraneous-dependencies

export async function onEventHandler(event: AWSCDKAsyncCustomResource.OnEventRequest): Promise<AWSCDKAsyncCustomResource.OnEventResponse> {
  console.log('Event: %j', event);

  const rds = new RDS();

  const physicalResourceId = `${event.ResourceProperties.DBInstanceIdentifier}-${event.ResourceProperties.DBInstanceIdentifier}`;

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    const data = await rds.createDBSnapshot({
      DBInstanceIdentifier: event.ResourceProperties.DBInstanceIdentifier,
      DBSnapshotIdentifier: event.ResourceProperties.DBSnapshotIdentifier,
    });
    return {
      PhysicalResourceId: physicalResourceId,
      Data: {
        DBSnapshotArn: data.DBSnapshot?.DBSnapshotArn,
      },
    };
  }

  if (event.RequestType === 'Delete') {
    await rds.deleteDBSnapshot({
      DBSnapshotIdentifier: event.ResourceProperties.DBSnapshotIdentifier,
    });
  }

  return {
    PhysicalResourceId: `${event.ResourceProperties.DBInstanceIdentifier}-${event.ResourceProperties.DBInstanceIdentifier}`,
  };
}

export async function isCompleteHandler(event: AWSCDKAsyncCustomResource.IsCompleteRequest): Promise<AWSCDKAsyncCustomResource.IsCompleteResponse> {
  console.log('Event: %j', event);

  const snapshotStatus = await tryGetSnapshotStatus(event.ResourceProperties.DBSnapshotIdentifier);

  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      return { IsComplete: snapshotStatus === 'available' };
    case 'Delete':
      return { IsComplete: snapshotStatus === undefined };
  }
}

async function tryGetSnapshotStatus(identifier: string): Promise<string | undefined> {
  try {
    const rds = new RDS();
    const data = await rds.describeDBSnapshots({
      DBSnapshotIdentifier: identifier,
    });
    return data.DBSnapshots?.[0].Status;
  } catch (err: any) {
    if (err.name === 'DBSnapshotNotFoundFault') {
      return undefined;
    }
    throw err;
  }
}
