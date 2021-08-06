/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
import { ClusterProps, executeStatement, getClusterPropsFromEvent, getResourceProperty } from './util';

interface TablePrivilege {
  readonly tableName: string;
  readonly privileges: string[];
}

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const username = getResourceProperty('username', event.ResourceProperties);
  const tablePrivileges = JSON.parse(getResourceProperty('tablePrivileges', event.ResourceProperties)) as TablePrivilege[];
  const clusterProps = getClusterPropsFromEvent(event.ResourceProperties);

  if (event.RequestType === 'Create') {
    await grantPrivileges(username, tablePrivileges, clusterProps);
    return { PhysicalResourceId: username };
  } else if (event.RequestType === 'Delete') {
    await revokePrivileges(username, tablePrivileges, clusterProps);
    return;
  } else if (event.RequestType === 'Update') {
    await updatePrivileges(username, tablePrivileges, clusterProps, event.OldResourceProperties);
    return { PhysicalResourceId: username };
  } else {
    /* eslint-disable-next-line dot-notation */
    throw new Error(`Unrecognized event type: ${event['RequestType']}`);
  }
}

async function revokePrivileges(username: string, tablePrivileges: TablePrivilege[], clusterProps: ClusterProps) {
  await Promise.all(tablePrivileges.map(({ tableName, privileges }) => {
    return executeStatement(`REVOKE ${privileges.join(', ')} ON ${tableName} FROM ${username}`, clusterProps);
  }));
}

async function grantPrivileges(username: string, tablePrivileges: TablePrivilege[], clusterProps: ClusterProps) {
  await Promise.all(tablePrivileges.map(({ tableName, privileges }) => {
    return executeStatement(`GRANT ${privileges.join(', ')} ON ${tableName} TO ${username}`, clusterProps);
  }));
}

async function updatePrivileges(
  username: string,
  tablePrivileges: TablePrivilege[],
  clusterProps: ClusterProps,
  oldResourceProperties: { [Key: string]: any },
) {
  const oldUsername = getResourceProperty('username', oldResourceProperties);
  const oldTablePrivileges = JSON.parse(getResourceProperty('tablePrivileges', oldResourceProperties)) as TablePrivilege[];
  if (oldUsername === username) {
    await revokePrivileges(username, oldTablePrivileges, clusterProps);
  }
  await grantPrivileges(username, tablePrivileges, clusterProps);
}
