/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
import { ClusterProps, executeStatement, getClusterPropsFromEvent, getResourceNameFromPhysicalId, getResourceProperty, makePhysicalId } from './util';

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
    return { PhysicalResourceId: makePhysicalId(tableName, clusterProps), Data: { tableName: tableName } };
  } else if (event.RequestType === 'Delete') {
    await dropTable(getResourceNameFromPhysicalId(event.PhysicalResourceId), clusterProps);
    return;
  } else if (event.RequestType === 'Update') {
    await updateTable(tableName, tableColumns, clusterProps, event.OldResourceProperties);
    return { PhysicalResourceId: makePhysicalId(tableName, clusterProps), Data: { tableName: tableName } };
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

async function updateTable(tableName: string, tableColumns: Column[], clusterProps: ClusterProps, oldResourceProperties: { [Key: string]: any }) {
  const oldClusterProps = getClusterPropsFromEvent(oldResourceProperties);
  if (clusterProps !== oldClusterProps) {
    return createTable(tableName, tableColumns, clusterProps);
  }

  const oldTableColumns = JSON.parse(getResourceProperty('tableColumns', oldResourceProperties)) as Column[];
  const oldTableName = oldResourceProperties.tableName;

  if (tableName !== oldTableName) {
    return createTable(tableName, tableColumns, clusterProps);
  }

  const changes: string[] = [];
  tableColumns.forEach(tableColumn => {
    const oldTableColumn = oldTableColumns.find(({ name: oldName }) => tableColumn.name === oldName);
    if (!oldTableColumn) {
      changes.push(`ADD ${tableColumn.name} ${tableColumn.dataType}`);
    } else {
      if (tableColumn.dataType !== oldTableColumn.dataType) {
        changes.push(`ALTER COLUMN ${tableColumn.name} TYPE ${tableColumn.dataType}`);
      }
    }
  });
  oldTableColumns.forEach(oldTableColumn => {
    const tableColumn = tableColumns.find(({ name }) => oldTableColumn.name === name);
    if (!tableColumn) {
      changes.push(`DROP ${oldTableColumn.name}`);
      // TODO: not sure if this is the right choice. can we simply ignore this? will queries break if the schema has extra columns? dropping could lose data "silently"
    }
  });
  await Promise.all(changes.map(change => executeStatement(`ALTER TABLE ${tableName} ${change}`, clusterProps)));
}
