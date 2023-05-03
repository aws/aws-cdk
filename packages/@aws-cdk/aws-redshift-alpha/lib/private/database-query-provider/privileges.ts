/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
import { Accessor, TablePrivilege, UserTablePrivilegesHandlerProps } from '../handler-props';
import { executeStatement } from './redshift-data';
import { ClusterProps } from './types';
import { makePhysicalId } from './util';

export async function handler(props: UserTablePrivilegesHandlerProps & ClusterProps, event: AWSLambda.CloudFormationCustomResourceEvent) {
  const accessor = props.accessor;
  const tablePrivileges = props.tablePrivileges;
  const clusterProps = props;

  if (event.RequestType === 'Create') {
    await grantPrivileges(accessor, tablePrivileges, clusterProps);
    return { PhysicalResourceId: makePhysicalId(accessor.name, clusterProps, event.RequestId) };
  } else if (event.RequestType === 'Delete') {
    await revokePrivileges(accessor, tablePrivileges, clusterProps);
    return;
  } else if (event.RequestType === 'Update') {
    const { replace } = await updatePrivileges(
      accessor,
      tablePrivileges,
      clusterProps,
      event.OldResourceProperties as UserTablePrivilegesHandlerProps & ClusterProps,
    );
    const physicalId = replace ? makePhysicalId(accessor.name, clusterProps, event.RequestId) : event.PhysicalResourceId;
    return { PhysicalResourceId: physicalId };
  } else {
    /* eslint-disable-next-line dot-notation */
    throw new Error(`Unrecognized event type: ${event['RequestType']}`);
  }
}

async function revokePrivileges(accessor: Accessor, tablePrivileges: TablePrivilege[], clusterProps: ClusterProps) {
  await Promise.all(tablePrivileges.map(({ tableName, actions }) => {
    return executeStatement(`REVOKE ${actions.join(', ')} ON ${tableName} FROM ${getAccessorString(accessor)}`, clusterProps);
  }));
}

async function grantPrivileges(accessor: Accessor, tablePrivileges: TablePrivilege[], clusterProps: ClusterProps) {
  await Promise.all(tablePrivileges.map(({ tableName, actions }) => {
    return executeStatement(`GRANT ${actions.join(', ')} ON ${tableName} TO ${getAccessorString(accessor)}`, clusterProps);
  }));
}

async function updatePrivileges(
  accessor: Accessor,
  tablePrivileges: TablePrivilege[],
  clusterProps: ClusterProps,
  oldResourceProperties: UserTablePrivilegesHandlerProps & ClusterProps,
): Promise<{ replace: boolean }> {
  const oldClusterProps = oldResourceProperties;
  if (clusterProps.clusterName !== oldClusterProps.clusterName || clusterProps.databaseName !== oldClusterProps.databaseName) {
    await grantPrivileges(accessor, tablePrivileges, clusterProps);
    return { replace: true };
  }

  const oldAccessor = oldResourceProperties.accessor;
  const oldUsername = oldResourceProperties.username;
  if (oldAccessor?.name ?? oldUsername !== accessor.name) {
    await grantPrivileges(accessor, tablePrivileges, clusterProps);
    return { replace: true };
  }

  const oldTablePrivileges = oldResourceProperties.tablePrivileges;
  if (oldTablePrivileges !== tablePrivileges) {
    await revokePrivileges(accessor, oldTablePrivileges, clusterProps);
    await grantPrivileges(accessor, tablePrivileges, clusterProps);
    return { replace: false };
  }

  return { replace: false };
}

function getAccessorString(accessor: Accessor) {
  const res = accessor.name;
  if (accessor.accessorType === 'USER') {
    return res;
  }
  return `${accessor.accessorType} ${res}`;
}
