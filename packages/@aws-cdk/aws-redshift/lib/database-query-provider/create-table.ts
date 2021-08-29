/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
import { ClusterProps, executeStatement, getClusterPropsFromEvent, getResourceProperty, makePhysicalId } from './util';

interface Column {
  name: string;
  dataType: string;
}

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const tableColumns = JSON.parse(getResourceProperty('tableColumns', event.ResourceProperties)) as Column[];
  const tableName = event.ResourceProperties.tableName;
  const clusterProps = getClusterPropsFromEvent(event.ResourceProperties);

  if (event.RequestType === 'Create') {
    await createTable(tableName, tableColumns, clusterProps);
    return { PhysicalResourceId: makeNewPhysicalId(tableName, clusterProps, event.RequestId), Data: { tableName: tableName } };
  } else if (event.RequestType === 'Delete') {
    await dropTable(tableName, clusterProps);
    return;
  } else if (event.RequestType === 'Update') {
    const { replace } = await updateTable(tableName, tableColumns, clusterProps, event.OldResourceProperties);
    const physicalId = replace ? makeNewPhysicalId(tableName, clusterProps, event.RequestId) : event.PhysicalResourceId;
    return { PhysicalResourceId: physicalId, Data: { tableName: tableName } };
  } else {
    /* eslint-disable-next-line dot-notation */
    throw new Error(`Unrecognized event type: ${event['RequestType']}`);
  }
}

function makeNewPhysicalId(tableName: string, clusterProps: ClusterProps, requestId: string): string {
  return `${makePhysicalId(tableName, clusterProps)}:${requestId}`;
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
  oldResourceProperties: { [Key: string]: any },
): Promise<{ replace: boolean }> {
  const oldClusterProps = getClusterPropsFromEvent(oldResourceProperties);
  if (clusterProps.clusterName !== oldClusterProps.clusterName || clusterProps.databaseName !== oldClusterProps.databaseName) {
    await createTable(tableName, tableColumns, clusterProps);
    return { replace: true };
  }

  const oldTableName = oldResourceProperties.tableName;
  if (tableName !== oldTableName) {
    await createTable(tableName, tableColumns, clusterProps);
    return { replace: true };
  }

  const oldTableColumns = JSON.parse(getResourceProperty('tableColumns', oldResourceProperties)) as Column[];
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
