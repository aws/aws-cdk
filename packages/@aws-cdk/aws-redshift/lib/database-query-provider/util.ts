/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as RedshiftData from 'aws-sdk/clients/redshiftdata';

const redshiftData = new RedshiftData();

export interface ClusterProps {
  clusterName: string;
  adminUserArn: string;
  databaseName: string;
}

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
    return await waitForStatementComplete(statementId);
  } else if (statement.Status === 'FINISHED') {
    return;
  } else {
    throw new Error(`Statement status was ${statement.Status}: ${statement.Error}`);
  }
}

export function getClusterPropsFromEvent(resourceProperties: { [Key: string]: any }): ClusterProps {
  const clusterName = getResourceProperty('clusterName', resourceProperties);
  const adminUserArn = getResourceProperty('adminUserArn', resourceProperties);
  const databaseName = getResourceProperty('databaseName', resourceProperties);
  return { clusterName, adminUserArn, databaseName };
}

export function makePhysicalId(resourceName: string, clusterProps: ClusterProps): string {
  return `${clusterProps.clusterName}:${clusterProps.databaseName}:${resourceName}`;
}

export function getResourceNameFromPhysicalId(physicalId: string): string {
  return physicalId.split(':')[2];
}

export function getResourceProperty(propertyName: string, resourceProperties: { [Key: string]: any }): any {
  const property = resourceProperties[propertyName];
  if (!property) {
    throw new Error(`Custom resource properties must contain value for \`${propertyName}\``);
  }
  return property;
}
