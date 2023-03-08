/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
import { executeStatement } from './redshift-data';
import { ClusterProps, TableAndClusterProps, TableSortStyle } from './types';
import { areColumnsEqual, getDistKeyColumn, getSortKeyColumns } from './util';
import { Column } from '../../table';

export async function handler(props: TableAndClusterProps, event: AWSLambda.CloudFormationCustomResourceEvent) {
  const tableNamePrefix = props.tableName.prefix;
  const tableNameSuffix = props.tableName.generateSuffix === 'true' ? `${event.RequestId.substring(0, 8)}` : '';
  const tableColumns = props.tableColumns;
  const tableAndClusterProps = props;
  const useColumnIds = props.useColumnIds;

  if (event.RequestType === 'Create') {
    const tableName = await createTable(tableNamePrefix, tableNameSuffix, tableColumns, tableAndClusterProps);
    return { PhysicalResourceId: tableName };
  } else if (event.RequestType === 'Delete') {
    await dropTable(event.PhysicalResourceId, tableAndClusterProps);
    return;
  } else if (event.RequestType === 'Update') {
    const tableName = await updateTable(
      event.PhysicalResourceId,
      tableNamePrefix,
      tableNameSuffix,
      tableColumns,
      useColumnIds,
      tableAndClusterProps,
      event.OldResourceProperties as TableAndClusterProps,
    );
    return { PhysicalResourceId: tableName };
  } else {
    /* eslint-disable-next-line dot-notation */
    throw new Error(`Unrecognized event type: ${event['RequestType']}`);
  }
}

async function createTable(
  tableNamePrefix: string,
  tableNameSuffix: string,
  tableColumns: Column[],
  tableAndClusterProps: TableAndClusterProps,
): Promise<string> {
  const tableName = tableNamePrefix + tableNameSuffix;
  const tableColumnsString = tableColumns.map(column => `${column.name} ${column.dataType}${getEncodingColumnString(column)}`).join();

  let statement = `CREATE TABLE ${tableName} (${tableColumnsString})`;

  if (tableAndClusterProps.distStyle) {
    statement += ` DISTSTYLE ${tableAndClusterProps.distStyle}`;
  }

  const distKeyColumn = getDistKeyColumn(tableColumns);
  if (distKeyColumn) {
    statement += ` DISTKEY(${distKeyColumn.name})`;
  }

  const sortKeyColumns = getSortKeyColumns(tableColumns);
  if (sortKeyColumns.length > 0) {
    const sortKeyColumnsString = getSortKeyColumnsString(sortKeyColumns);
    statement += ` ${tableAndClusterProps.sortStyle} SORTKEY(${sortKeyColumnsString})`;
  }

  await executeStatement(statement, tableAndClusterProps);

  for (const column of tableColumns) {
    if (column.comment) {
      await executeStatement(`COMMENT ON COLUMN ${tableName}.${column.name} IS '${column.comment}'`, tableAndClusterProps);
    }
  }
  if (tableAndClusterProps.tableComment) {
    await executeStatement(`COMMENT ON TABLE ${tableName} IS '${tableAndClusterProps.tableComment}'`, tableAndClusterProps);
  }

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
  useColumnIds: boolean,
  tableAndClusterProps: TableAndClusterProps,
  oldResourceProperties: TableAndClusterProps,
): Promise<string> {
  const alterationStatements: string[] = [];

  const oldClusterProps = oldResourceProperties;
  if (tableAndClusterProps.clusterName !== oldClusterProps.clusterName || tableAndClusterProps.databaseName !== oldClusterProps.databaseName) {
    return createTable(tableNamePrefix, tableNameSuffix, tableColumns, tableAndClusterProps);
  }

  const oldTableNamePrefix = oldResourceProperties.tableName.prefix;
  if (tableNamePrefix !== oldTableNamePrefix) {
    return createTable(tableNamePrefix, tableNameSuffix, tableColumns, tableAndClusterProps);
  }

  const oldTableColumns = oldResourceProperties.tableColumns;
  const columnDeletions = oldTableColumns.filter(oldColumn => (
    tableColumns.every(column => {
      if (useColumnIds) {
        return oldColumn.id ? oldColumn.id !== column.id : oldColumn.name !== column.name;
      }
      return oldColumn.name !== column.name;
    })
  ));
  if (columnDeletions.length > 0) {
    alterationStatements.push(...columnDeletions.map(column => `ALTER TABLE ${tableName} DROP COLUMN ${column.name}`));
  }

  const columnAdditions = tableColumns.filter(column => {
    return !oldTableColumns.some(oldColumn => {
      if (useColumnIds) {
        return oldColumn.id ? oldColumn.id === column.id : oldColumn.name === column.name;
      }
      return oldColumn.name === column.name;
    });
  }).map(column => `ADD ${column.name} ${column.dataType}`);
  if (columnAdditions.length > 0) {
    alterationStatements.push(...columnAdditions.map(addition => `ALTER TABLE ${tableName} ${addition}`));
  }

  const columnEncoding = tableColumns.filter(column => {
    return oldTableColumns.some(oldColumn => column.name === oldColumn.name && column.encoding !== oldColumn.encoding);
  }).map(column => `ALTER COLUMN ${column.name} ENCODE ${column.encoding || 'AUTO'}`);
  if (columnEncoding.length > 0) {
    alterationStatements.push(`ALTER TABLE ${tableName} ${columnEncoding.join(', ')}`);
  }

  const columnComments = tableColumns.filter(column => {
    return oldTableColumns.some(oldColumn => column.name === oldColumn.name && column.comment !== oldColumn.comment);
  }).map(column => `COMMENT ON COLUMN ${tableName}.${column.name} IS ${column.comment ? `'${column.comment}'` : 'NULL'}`);
  if (columnComments.length > 0) {
    alterationStatements.push(...columnComments);
  }

  if (useColumnIds) {
    const columnNameUpdates = tableColumns.reduce((updates, column) => {
      const oldColumn = oldTableColumns.find(oldCol => oldCol.id && oldCol.id === column.id);
      if (oldColumn && oldColumn.name !== column.name) {
        updates[oldColumn.name] = column.name;
      }
      return updates;
    }, {} as Record<string, string>);
    if (Object.keys(columnNameUpdates).length > 0) {
      alterationStatements.push(...Object.entries(columnNameUpdates).map(([oldName, newName]) => (
        `ALTER TABLE ${tableName} RENAME COLUMN ${oldName} TO ${newName}`
      )));
    }
  }

  const oldDistStyle = oldResourceProperties.distStyle;
  if ((!oldDistStyle && tableAndClusterProps.distStyle) ||
    (oldDistStyle && !tableAndClusterProps.distStyle)) {
    return createTable(tableNamePrefix, tableNameSuffix, tableColumns, tableAndClusterProps);
  } else if (oldDistStyle !== tableAndClusterProps.distStyle) {
    alterationStatements.push(`ALTER TABLE ${tableName} ALTER DISTSTYLE ${tableAndClusterProps.distStyle}`);
  }

  const oldDistKey = getDistKeyColumn(oldTableColumns)?.name;
  const newDistKey = getDistKeyColumn(tableColumns)?.name;
  if ((!oldDistKey && newDistKey ) || (oldDistKey && !newDistKey)) {
    return createTable(tableNamePrefix, tableNameSuffix, tableColumns, tableAndClusterProps);
  } else if (oldDistKey !== newDistKey) {
    alterationStatements.push(`ALTER TABLE ${tableName} ALTER DISTKEY ${newDistKey}`);
  }

  const oldSortKeyColumns = getSortKeyColumns(oldTableColumns);
  const newSortKeyColumns = getSortKeyColumns(tableColumns);
  const oldSortStyle = oldResourceProperties.sortStyle;
  const newSortStyle = tableAndClusterProps.sortStyle;
  if ((oldSortStyle === newSortStyle && !areColumnsEqual(oldSortKeyColumns, newSortKeyColumns))
    || (oldSortStyle !== newSortStyle)) {
    switch (newSortStyle) {
      case TableSortStyle.INTERLEAVED:
        // INTERLEAVED sort key addition requires replacement.
        // https://docs.aws.amazon.com/redshift/latest/dg/r_ALTER_TABLE.html
        return createTable(tableNamePrefix, tableNameSuffix, tableColumns, tableAndClusterProps);

      case TableSortStyle.COMPOUND: {
        const sortKeyColumnsString = getSortKeyColumnsString(newSortKeyColumns);
        alterationStatements.push(`ALTER TABLE ${tableName} ALTER ${newSortStyle} SORTKEY(${sortKeyColumnsString})`);
        break;
      }

      case TableSortStyle.AUTO: {
        alterationStatements.push(`ALTER TABLE ${tableName} ALTER SORTKEY ${newSortStyle}`);
        break;
      }
    }
  }

  const oldComment = oldResourceProperties.tableComment;
  const newComment = tableAndClusterProps.tableComment;
  if (oldComment !== newComment) {
    alterationStatements.push(`COMMENT ON TABLE ${tableName} IS ${newComment ? `'${newComment}'` : 'NULL'}`);
  }

  await Promise.all(alterationStatements.map(statement => executeStatement(statement, tableAndClusterProps)));

  return tableName;
}

function getSortKeyColumnsString(sortKeyColumns: Column[]) {
  return sortKeyColumns.map(column => column.name).join();
}

function getEncodingColumnString(column: Column): string {
  if (column.encoding) {
    return ` ENCODE ${column.encoding}`;
  }
  return '';
}
