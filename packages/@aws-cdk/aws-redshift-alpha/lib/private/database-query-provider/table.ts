
import type * as AWSLambda from 'aws-lambda';
import { quoteIdentifier, quoteLiteral } from './escape';
import { executeStatement } from './redshift-data';
import type { ClusterProps, TableAndClusterProps } from './types';
import { TableSortStyle } from './types';
import { areColumnsEqual, getDistKeyColumn, getSortKeyColumns, makePhysicalId } from './util';
import type { Column } from '../../table';

export async function handler(props: TableAndClusterProps, event: AWSLambda.CloudFormationCustomResourceEvent) {
  const tableNamePrefix = props.tableName.prefix;
  const getTableNameSuffix = (generateSuffix: string) => generateSuffix === 'true' ? `${event.StackId.substring(event.StackId.length - 12)}` : '';
  const tableColumns = props.tableColumns;
  const tableAndClusterProps = props;
  const useColumnIds = props.useColumnIds;
  let tableName = tableNamePrefix + getTableNameSuffix(props.tableName.generateSuffix);

  if (event.RequestType === 'Create') {
    tableName = await createTable(tableNamePrefix, getTableNameSuffix(props.tableName.generateSuffix), tableColumns, tableAndClusterProps);
    return { PhysicalResourceId: makePhysicalId(tableName, tableAndClusterProps, event.StackId.substring(event.StackId.length - 12)) };
  } else if (event.RequestType === 'Delete') {
    await dropTable(
      event.PhysicalResourceId.includes(event.StackId.substring(event.StackId.length - 12)) ? tableName : event.PhysicalResourceId,
      tableAndClusterProps,
    );
    return;
  } else if (event.RequestType === 'Update') {
    const isTableV2 = event.PhysicalResourceId.includes(event.StackId.substring(event.StackId.length - 12));
    const oldTableName = event.OldResourceProperties.tableName.prefix + getTableNameSuffix(event.OldResourceProperties.tableName.generateSuffix);
    tableName = await updateTable(
      isTableV2 ? oldTableName : event.PhysicalResourceId,
      tableNamePrefix,
      getTableNameSuffix(props.tableName.generateSuffix),
      tableColumns,
      useColumnIds,
      tableAndClusterProps,
      event.OldResourceProperties as unknown as TableAndClusterProps,
      isTableV2,
    );
    return { PhysicalResourceId: event.PhysicalResourceId };
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
  const tableColumnsString = tableColumns.map(column => `${quoteIdentifier(column.name)} ${column.dataType}${getEncodingColumnString(column)}`).join();

  let statement = `CREATE TABLE ${quoteIdentifier(tableName)} (${tableColumnsString})`;

  if (tableAndClusterProps.distStyle) {
    statement += ` DISTSTYLE ${tableAndClusterProps.distStyle}`;
  }

  const distKeyColumn = getDistKeyColumn(tableColumns);
  if (distKeyColumn) {
    statement += ` DISTKEY(${quoteIdentifier(distKeyColumn.name)})`;
  }

  const sortKeyColumns = getSortKeyColumns(tableColumns);
  if (sortKeyColumns.length > 0) {
    const sortKeyColumnsString = getSortKeyColumnsString(sortKeyColumns);
    statement += ` ${tableAndClusterProps.sortStyle} SORTKEY(${sortKeyColumnsString})`;
  }

  await executeStatement(statement, tableAndClusterProps);

  for (const column of tableColumns) {
    if (column.comment) {
      await executeStatement(`COMMENT ON COLUMN ${quoteIdentifier(tableName)}.${quoteIdentifier(column.name)} IS ${quoteLiteral(column.comment)}`, tableAndClusterProps);
    }
  }
  if (tableAndClusterProps.tableComment) {
    await executeStatement(`COMMENT ON TABLE ${quoteIdentifier(tableName)} IS ${quoteLiteral(tableAndClusterProps.tableComment)}`, tableAndClusterProps);
  }

  return tableName;
}

async function dropTable(tableName: string, clusterProps: ClusterProps) {
  await executeStatement(`DROP TABLE ${quoteIdentifier(tableName)}`, clusterProps);
}

async function updateTable(
  tableName: string,
  tableNamePrefix: string,
  tableNameSuffix: string,
  tableColumns: Column[],
  useColumnIds: boolean,
  tableAndClusterProps: TableAndClusterProps,
  oldResourceProperties: TableAndClusterProps,
  isTableV2: boolean,
): Promise<string> {
  const alterationStatements: string[] = [];
  const newTableName = tableNamePrefix + tableNameSuffix;

  const oldClusterProps = oldResourceProperties;
  if (tableAndClusterProps.clusterName !== oldClusterProps.clusterName || tableAndClusterProps.databaseName !== oldClusterProps.databaseName) {
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
    alterationStatements.push(...columnDeletions.map(column => `ALTER TABLE ${quoteIdentifier(tableName)} DROP COLUMN ${quoteIdentifier(column.name)}`));
  }

  const columnAdditions = tableColumns.filter(column => {
    return !oldTableColumns.some(oldColumn => {
      if (useColumnIds) {
        return oldColumn.id ? oldColumn.id === column.id : oldColumn.name === column.name;
      }
      return oldColumn.name === column.name;
    });
  }).map(column => `ADD ${quoteIdentifier(column.name)} ${column.dataType}`);
  if (columnAdditions.length > 0) {
    alterationStatements.push(...columnAdditions.map(addition => `ALTER TABLE ${quoteIdentifier(tableName)} ${addition}`));
  }

  const columnEncoding = tableColumns.filter(column => {
    return oldTableColumns.some(oldColumn => column.name === oldColumn.name && column.encoding !== oldColumn.encoding);
  }).map(column => `ALTER COLUMN ${quoteIdentifier(column.name)} ENCODE ${column.encoding || 'AUTO'}`);
  if (columnEncoding.length > 0) {
    alterationStatements.push(`ALTER TABLE ${quoteIdentifier(tableName)} ${columnEncoding.join(', ')}`);
  }

  const columnComments = tableColumns.filter(column => {
    return oldTableColumns.some(oldColumn => column.name === oldColumn.name && column.comment !== oldColumn.comment);
  }).map(column => `COMMENT ON COLUMN ${quoteIdentifier(tableName)}.${quoteIdentifier(column.name)} IS ${column.comment ? quoteLiteral(column.comment) : 'NULL'}`);
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
        `ALTER TABLE ${quoteIdentifier(tableName)} RENAME COLUMN ${quoteIdentifier(oldName)} TO ${quoteIdentifier(newName)}`
      )));
    }
  }

  const oldDistStyle = oldResourceProperties.distStyle;
  if ((!oldDistStyle && tableAndClusterProps.distStyle) ||
    (oldDistStyle && !tableAndClusterProps.distStyle)) {
    return createTable(tableNamePrefix, tableNameSuffix, tableColumns, tableAndClusterProps);
  } else if (oldDistStyle !== tableAndClusterProps.distStyle) {
    alterationStatements.push(`ALTER TABLE ${quoteIdentifier(tableName)} ALTER DISTSTYLE ${tableAndClusterProps.distStyle}`);
  }

  const oldDistKey = getDistKeyColumn(oldTableColumns)?.name;
  const newDistKey = getDistKeyColumn(tableColumns)?.name;
  if (!oldDistKey && newDistKey) {
    // Table has no existing distribution key, add a new one
    alterationStatements.push(`ALTER TABLE ${quoteIdentifier(tableName)} ALTER DISTSTYLE KEY DISTKEY ${quoteIdentifier(newDistKey)}`);
  } else if (oldDistKey && !newDistKey) {
    // Table has a distribution key, remove and set to AUTO
    alterationStatements.push(`ALTER TABLE ${quoteIdentifier(tableName)} ALTER DISTSTYLE AUTO`);
  } else if (oldDistKey !== newDistKey) {
    // Table has an existing distribution key, change it
    // (both keys are defined here; the undefined cases are handled by the branches above)
    alterationStatements.push(`ALTER TABLE ${quoteIdentifier(tableName)} ALTER DISTKEY ${quoteIdentifier(newDistKey!)}`);
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
        alterationStatements.push(`ALTER TABLE ${quoteIdentifier(tableName)} ALTER ${newSortStyle} SORTKEY(${sortKeyColumnsString})`);
        break;
      }

      case TableSortStyle.AUTO: {
        alterationStatements.push(`ALTER TABLE ${quoteIdentifier(tableName)} ALTER SORTKEY ${newSortStyle}`);
        break;
      }
    }
  }

  const oldComment = oldResourceProperties.tableComment;
  const newComment = tableAndClusterProps.tableComment;
  if (oldComment !== newComment) {
    alterationStatements.push(`COMMENT ON TABLE ${quoteIdentifier(tableName)} IS ${newComment ? quoteLiteral(newComment) : 'NULL'}`);
  }

  // Limited by human input
  // eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
  await Promise.all(alterationStatements.map(statement => executeStatement(statement, tableAndClusterProps)));

  if (isTableV2) {
    const oldTableNamePrefix = oldResourceProperties.tableName.prefix;
    if (tableNamePrefix !== oldTableNamePrefix) {
      await executeStatement(`ALTER TABLE ${quoteIdentifier(tableName)} RENAME TO ${quoteIdentifier(newTableName)}`, tableAndClusterProps);
      return tableNamePrefix + tableNameSuffix;
    }
  }

  return tableName;
}

function getSortKeyColumnsString(sortKeyColumns: Column[]) {
  return sortKeyColumns.map(column => quoteIdentifier(column.name)).join();
}

function getEncodingColumnString(column: Column): string {
  if (column.encoding) {
    return ` ENCODE ${column.encoding}`;
  }
  return '';
}
