/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
import { executeStatement } from './redshift-data';
import { ClusterProps } from './types';
import { makePhysicalId } from './util';
import { TablePrivilege, UserTablePrivilegesHandlerProps } from '../handler-props';

export async function handler(props: UserTablePrivilegesHandlerProps & ClusterProps, event: AWSLambda.CloudFormationCustomResourceEvent) {
  const username = props.username;
  const tablePrivileges = props.tablePrivileges;
  const clusterProps = props;

  if (event.RequestType === 'Create') {
    await grantPrivileges(username, tablePrivileges, clusterProps);
    return { PhysicalResourceId: makePhysicalId(username, clusterProps, event.RequestId) };
  } else if (event.RequestType === 'Delete') {
    await revokePrivileges(username, tablePrivileges, clusterProps);
    return;
  } else if (event.RequestType === 'Update') {
    const { replace } = await updatePrivileges(
      username,
      tablePrivileges,
      clusterProps,
      event.OldResourceProperties as UserTablePrivilegesHandlerProps & ClusterProps,
    );
    const physicalId = replace ? makePhysicalId(username, clusterProps, event.RequestId) : event.PhysicalResourceId;
    return { PhysicalResourceId: physicalId };
  } else {
    /* eslint-disable-next-line dot-notation */
    throw new Error(`Unrecognized event type: ${event['RequestType']}`);
  }
}

async function revokePrivileges(username: string, tablePrivileges: TablePrivilege[], clusterProps: ClusterProps) {
  await Promise.all(tablePrivileges.map(({ tableName, actions }) => {
    return executeStatement(`REVOKE ${actions.join(', ')} ON ${tableName} FROM ${username}`, clusterProps);
  }));
}

async function grantPrivileges(username: string, tablePrivileges: TablePrivilege[], clusterProps: ClusterProps) {
  await Promise.all(tablePrivileges.map(({ tableName, actions }) => {
    return executeStatement(`GRANT ${actions.join(', ')} ON ${tableName} TO ${username}`, clusterProps);
  }));
}

async function updatePrivileges(
  username: string,
  tablePrivileges: TablePrivilege[],
  clusterProps: ClusterProps,
  oldResourceProperties: UserTablePrivilegesHandlerProps & ClusterProps,
): Promise<{ replace: boolean }> {
  const oldClusterProps = oldResourceProperties;
  if (clusterProps.clusterName !== oldClusterProps.clusterName || clusterProps.databaseName !== oldClusterProps.databaseName) {
    await grantPrivileges(username, tablePrivileges, clusterProps);
    return { replace: true };
  }

  const oldUsername = oldResourceProperties.username;
  if (oldUsername !== username) {
    await grantPrivileges(username, tablePrivileges, clusterProps);
    return { replace: true };
  }

  const oldTablePrivileges = oldResourceProperties.tablePrivileges;
  if (oldTablePrivileges !== tablePrivileges) {
    await revokePrivileges(username, oldTablePrivileges, clusterProps);
    await grantPrivileges(username, tablePrivileges, clusterProps);
    return { replace: false };
  }

  return { replace: false };
}
