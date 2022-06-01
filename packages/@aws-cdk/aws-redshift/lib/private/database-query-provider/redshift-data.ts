/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as RedshiftData from 'aws-sdk/clients/redshiftdata';
import { ClusterProps } from './types';

const redshiftData = new RedshiftData();

/**
 * Execute one or more SQL statements in a transaction.
 * [docs]{@link https://docs.aws.amazon.com/redshift-data/latest/APIReference/API_BatchExecuteStatement.html}
 * @param {string[]} statements - The ordered list of SQL statements.
 * @param {ClusterProps} clusterProps - The properties of the Redshift Cluster
 * to execute against.
 * @returns {Promise<void>}
 */
export async function executeStatement(statements: string[], clusterProps: ClusterProps): Promise<void> {
  // You can execute at most 40 statements in a batch execute transaction.
  // https://docs.aws.amazon.com/redshift-data/latest/APIReference/API_BatchExecuteStatement.html#API_BatchExecuteStatement_RequestSyntax
  const maxBatchSize = 40;
  for (
    let statementIndex = 0;
    statementIndex < Math.ceil(statements.length / maxBatchSize);
    statementIndex++
  ) {
    const executeStatementProps = {
      ClusterIdentifier: clusterProps.clusterName,
      Database: clusterProps.databaseName,
      SecretArn: clusterProps.adminUserArn,
      Sqls: statements.slice(
        statementIndex * maxBatchSize,
        (statementIndex + 1 ) * maxBatchSize,
      ),
    };
    const executedStatement = await redshiftData.batchExecuteStatement(executeStatementProps).promise();
    if (!executedStatement.Id) {
      throw new Error('Service error: Statement execution did not return a statement ID');
    }
    await waitForStatementComplete(executedStatement.Id);
  }
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
