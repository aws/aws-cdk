/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as RedshiftData from 'aws-sdk/clients/redshiftdata';

const redshiftData = new RedshiftData();

const waitTimeout = 100;
export async function waitForStatementComplete(statementId?: string): Promise<void> {
  if (!statementId) {
    throw new Error('Service error: Statement execution did not return a statement ID');
  }
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

export interface ClusterParams {
  clusterId: string;
  adminUserArn: string;
  database: string;
  tableName: string;
}

export function getClusterParamsFromEnv(): ClusterParams {
  const env = process.env;
  if (!env.clusterName || !env.adminUserArn || !env.database || !env.tableName) {
    throw new Error(`Environment not setup, must provide values for all variables but given: ${JSON.stringify({ clusterName: env.clusterName, adminUserArn: env.adminUserArn, database: env.database, table: env.table, tableColumns: env.tableColumns })}`);
  }
  return {
    clusterId: env.clusterName,
    adminUserArn: env.adminUserArn,
    database: env.database,
    tableName: env.tableName,
  };
}
