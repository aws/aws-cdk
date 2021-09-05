/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
import { Column } from '../../table';
import { TableHandlerProps } from '../handler-props';
import { ClusterProps, executeStatement, makePhysicalId } from './util';

export async function handler(props: TableHandlerProps & ClusterProps, event: AWSLambda.CloudFormationCustomResourceEvent) {
  const tableName = props.tableName;
  const tableColumns = props.tableColumns;
  const clusterProps = props;

  if (event.RequestType === 'Create') {
    await createTable(tableName, tableColumns, clusterProps);
    return { PhysicalResourceId: makePhysicalId(tableName, clusterProps, event.RequestId), Data: { tableName: tableName } };
  } else if (event.RequestType === 'Delete') {
    await dropTable(tableName, clusterProps);
    return;
  } else if (event.RequestType === 'Update') {
    const { replace } = await updateTable(tableName, tableColumns, clusterProps, event.OldResourceProperties as TableHandlerProps & ClusterProps);
    const physicalId = replace ? makePhysicalId(tableName, clusterProps, event.RequestId) : event.PhysicalResourceId;
    return { PhysicalResourceId: physicalId, Data: { tableName: tableName } };
  } else {
    /* eslint-disable-next-line dot-notation */
    throw new Error(`Unrecognized event type: ${event['RequestType']}`);
  }
}

async function createTable(tableName: string, tableColumns: Column[], clusterProps: ClusterProps) {
  const tableColumnsString = tableColumns.map(column => `${column.name} ${column.dataType}`).join();
  await executeStatement(`CREATE TABLE ${tableName} (${tableColumnsString})`, clusterProps);
}

async function dropTable(tableName: string, clusterProps: ClusterProps) {
  await executeStatement(`DROP TABLE ${tableName}`, clusterProps);
}

async function updateTable(
  tableName: string,
  tableColumns: Column[],
  clusterProps: ClusterProps,
  oldResourceProperties: TableHandlerProps & ClusterProps,
): Promise<{ replace: boolean }> {
  const oldClusterProps = oldResourceProperties;
  if (clusterProps.clusterName !== oldClusterProps.clusterName || clusterProps.databaseName !== oldClusterProps.databaseName) {
    await createTable(tableName, tableColumns, clusterProps);
    return { replace: true };
  }

  const oldTableName = oldResourceProperties.tableName;
  if (tableName !== oldTableName) {
    await createTable(tableName, tableColumns, clusterProps);
    return { replace: true };
  }

  const oldTableColumns = oldResourceProperties.tableColumns;
  if (!oldTableColumns.every(oldColumn => tableColumns.some(column => column.name === oldColumn.name && column.dataType === oldColumn.dataType))) {
    await createTable(tableName, tableColumns, clusterProps);
    return { replace: true };
  }

  const additions = tableColumns.filter(column => {
    return !oldTableColumns.some(oldColumn => column.name === oldColumn.name && column.dataType === oldColumn.dataType);
  }).map(column => `ADD ${column.name} ${column.dataType}`);
  await Promise.all(additions.map(addition => executeStatement(`ALTER TABLE ${tableName} ${addition}`, clusterProps)));

  return { replace: false };
}
