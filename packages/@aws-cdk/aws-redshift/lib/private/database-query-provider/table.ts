/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
import { Column } from '../../table';
import { TableHandlerProps } from '../handler-props';
import { ClusterProps, executeStatement } from './util';

export async function handler(props: TableHandlerProps & ClusterProps, event: AWSLambda.CloudFormationCustomResourceEvent) {
  const tableNamePrefix = props.tableName.prefix;
  const tableNameSuffix = props.tableName.generateSuffix ? `${event.RequestId.substring(0, 8)}` : '';
  const tableColumns = props.tableColumns;
  const clusterProps = props;

  if (event.RequestType === 'Create') {
    const tableName = await createTable(tableNamePrefix, tableNameSuffix, tableColumns, clusterProps);
    return { PhysicalResourceId: tableName };
  } else if (event.RequestType === 'Delete') {
    await dropTable(event.PhysicalResourceId, clusterProps);
    return;
  } else if (event.RequestType === 'Update') {
    const tableName = await updateTable(
      event.PhysicalResourceId,
      tableNamePrefix,
      tableNameSuffix,
      tableColumns,
      clusterProps,
      event.OldResourceProperties as TableHandlerProps & ClusterProps,
    );
    return { PhysicalResourceId: tableName };
  } else {
    /* eslint-disable-next-line dot-notation */
    throw new Error(`Unrecognized event type: ${event['RequestType']}`);
  }
}

async function createTable(tableNamePrefix: string, tableNameSuffix: string, tableColumns: Column[], clusterProps: ClusterProps): Promise<string> {
  const tableName = tableNamePrefix + tableNameSuffix;
  const tableColumnsString = tableColumns.map(column => `${column.name} ${column.dataType}`).join();
  await executeStatement(`CREATE TABLE ${tableName} (${tableColumnsString})`, clusterProps);
  return tableName;
}

async function dropTable(tableName: string, clusterProps: ClusterProps) {
  await executeStatement(`DROP TABLE ${tableName}`, clusterProps);
}

async function updateTable(
  tableName: string,
  tableNamePrefix: string,
  tableNameSuffix: string,
  tableColumns: Column[],
  clusterProps: ClusterProps,
  oldResourceProperties: TableHandlerProps & ClusterProps,
): Promise<string> {
  const oldClusterProps = oldResourceProperties;
  if (clusterProps.clusterName !== oldClusterProps.clusterName || clusterProps.databaseName !== oldClusterProps.databaseName) {
    return createTable(tableNamePrefix, tableNameSuffix, tableColumns, clusterProps);
  }

  const oldTableNamePrefix = oldResourceProperties.tableName.prefix;
  if (tableNamePrefix !== oldTableNamePrefix) {
    return createTable(tableNamePrefix, tableNameSuffix, tableColumns, clusterProps);
  }

  const oldTableColumns = oldResourceProperties.tableColumns;
  if (!oldTableColumns.every(oldColumn => tableColumns.some(column => column.name === oldColumn.name && column.dataType === oldColumn.dataType))) {
    return createTable(tableNamePrefix, tableNameSuffix, tableColumns, clusterProps);
  }

  const additions = tableColumns.filter(column => {
    return !oldTableColumns.some(oldColumn => column.name === oldColumn.name && column.dataType === oldColumn.dataType);
  }).map(column => `ADD ${column.name} ${column.dataType}`);
  await Promise.all(additions.map(addition => executeStatement(`ALTER TABLE ${tableName} ${addition}`, clusterProps)));

  return tableName;
}
