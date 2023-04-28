/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
import { UserGroupHandlerProps } from '../handler-props';
import { executeStatement } from './redshift-data';
import { ClusterProps } from './types';
import { makePhysicalId } from './util';

export async function handler(props: UserGroupHandlerProps & ClusterProps, event: AWSLambda.CloudFormationCustomResourceEvent) {
  const groupName = props.groupName;
  const users = props.users ?? [];
  const clusterProps = props;

  if (event.RequestType === 'Create') {
    await createGroup(groupName, users, clusterProps);
    return { PhysicalResourceId: makePhysicalId(groupName, clusterProps, event.RequestId), Data: { groupName: groupName } };
  } else if (event.RequestType === 'Delete') {
    await dropGroup(groupName, clusterProps);
    return;
  } else if (event.RequestType === 'Update') {
    const { replace } = await updateGroup(
      groupName,
      users,
      clusterProps,
      event.OldResourceProperties as UserGroupHandlerProps & ClusterProps,
    );
    const physicalId = replace ? makePhysicalId(groupName, clusterProps, event.RequestId) : event.PhysicalResourceId;
    return { PhysicalResourceId: physicalId, Data: { groupName: groupName } };
  } else {
    /* eslint-disable-next-line dot-notation */
    throw new Error(`Unrecognized event type: ${event['RequestType']}`);
  }
}

async function dropGroup(groupName: string, clusterProps: ClusterProps) {
  await executeStatement(`DROP GROUP ${groupName}`, clusterProps);
}

async function createGroup(groupName: string, users: string[], clusterProps: ClusterProps) {
  await executeStatement(`CREATE GROUP ${groupName}${getUserOnCreationString(users)}`, clusterProps);
}

async function updateGroup(
  groupName: string,
  users: string[],
  clusterProps: ClusterProps,
  oldResourceProperties: UserGroupHandlerProps & ClusterProps,
): Promise<{ replace: boolean }> {
  const oldClusterProps = oldResourceProperties;
  if (clusterProps.clusterName !== oldClusterProps.clusterName || clusterProps.databaseName !== oldClusterProps.databaseName) {
    await createGroup(groupName, users, clusterProps);
    return { replace: true };
  }

  const oldGroupName = oldResourceProperties.groupName;
  if (groupName !== oldGroupName) {
    await createGroup(groupName, users, clusterProps);
    return { replace: true };
  }

  const oldUsers = oldResourceProperties.users ?? [];
  if (
    users.length !== oldUsers.length ||
    users.some((user) => !oldUsers.includes(user)) ||
    oldUsers.some((user) => !users.includes(user))
  ) {
    await createGroup(groupName, users, clusterProps);
    return { replace: true };
  }

  return { replace: false };
}

function getUserOnCreationString(users: string[]): string {
  if (users.length > 0) {
    return ` WITH USER ${users.join(', ')}`;
  }
  return '';
}