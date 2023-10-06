/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
import { TablePrivilege, UserTablePrivilegesHandlerProps } from '../handler-props';
import { executeStatement } from './redshift-data';
import { ClusterProps } from './types';
import { makePhysicalId } from './util';

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
  const tablesToRevoke = oldTablePrivileges.filter(({ tableId, actions }) => (
    tablePrivileges.find(({ tableId: otherTableId, actions: otherActions }) => (
      tableId === otherTableId && actions.some(action => !otherActions.includes(action))
    ))
  ));
  if (tablesToRevoke.length > 0) {
    await revokePrivileges(username, tablesToRevoke, clusterProps);
  }

  const tablesToGrant = tablePrivileges.filter(({ tableId, tableName, actions }) => {
    const tableAdded = !oldTablePrivileges.find(({ tableId: otherTableId, tableName: otherTableName }) => (
      tableId === otherTableId && tableName === otherTableName
    ));
    const actionsAdded = oldTablePrivileges.find(({ tableId: otherTableId, actions: otherActions }) => (
      tableId === otherTableId && otherActions.some(action => !actions.includes(action))
    ));
    return tableAdded || actionsAdded;
  });
  if (tablesToGrant.length > 0) {
    await grantPrivileges(username, tablesToGrant, clusterProps);
  }

  return { replace: false };
}
