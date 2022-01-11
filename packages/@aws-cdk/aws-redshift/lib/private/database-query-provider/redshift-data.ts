/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as RedshiftData from 'aws-sdk/clients/redshiftdata';
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
