/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as RedshiftData from 'aws-sdk/clients/redshiftdata';
import { Column } from '../../table';
import { ClusterProps } from './types';

const redshiftData = new RedshiftData();

export async function executeStatement(statement: string, clusterProps: ClusterProps): Promise<void> {
  const executeStatementProps = {
    ClusterIdentifier: clusterProps.clusterName,
    Database: clusterProps.databaseName,
    SecretArn: clusterProps.adminUserArn,
    Sql: statement,
  };
  const executedStatement = await redshiftData.executeStatement(executeStatementProps).promise();
  if (!executedStatement.Id) {
    throw new Error('Service error: Statement execution did not return a statement ID');
  }
  await waitForStatementComplete(executedStatement.Id);
}

const waitTimeout = 100;
async function waitForStatementComplete(statementId: string): Promise<void> {
  await new Promise((resolve: (value: void) => void) => {
    setTimeout(() => resolve(), waitTimeout);
  });
  const statement = await redshiftData.describeStatement({ Id: statementId }).promise();
  if (statement.Status !== 'FINISHED' && statement.Status !== 'FAILED' && statement.Status !== 'ABORTED') {
    return waitForStatementComplete(statementId);
  } else if (statement.Status === 'FINISHED') {
    return;
  } else {
    throw new Error(`Statement status was ${statement.Status}: ${statement.Error}`);
  }
}

export function makePhysicalId(resourceName: string, clusterProps: ClusterProps, requestId: string): string {
  return `${clusterProps.clusterName}:${clusterProps.databaseName}:${resourceName}:${requestId}`;
}

export function getDistKeyColumn(columns: Column[]): Column | undefined {
  // string comparison is required for custom resource since everything is passed as string
  const distKeyColumns = columns.filter(column => column.distKey === true || (column.distKey as unknown as string) === 'true');

  if (distKeyColumns.length === 0) {
    return undefined;
  } else if (distKeyColumns.length > 1) {
    throw new Error('Multiple dist key columns found');
  }

  return distKeyColumns[0];
}

export function getSortKeyColumns(columns: Column[]): Column[] {
  // string comparison is required for custom resource since everything is passed as string
  return columns.filter(column => column.sortKey === true || (column.sortKey as unknown as string) === 'true');
}

export function areColumnsEqual(columnsA: Column[], columnsB: Column[]): boolean {
  if (columnsA.length !== columnsB.length) {
    return false;
  }
  return columnsA.every(columnA => {
    return columnsB.find(column => column.name === columnA.name && column.dataType === columnA.dataType);
  });
}
