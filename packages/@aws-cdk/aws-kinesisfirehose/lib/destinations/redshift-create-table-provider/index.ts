/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as RedshiftData from 'aws-sdk/clients/redshiftdata';

const redshiftData = new RedshiftData();

interface Column {
  name: string;
  dataType: string;
}

interface ClusterParams {
  clusterId: string;
  masterSecretArn: string;
  database: string;
  tableName: string;
  tableColumns: Column[]
}

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const env = process.env;
  if (!env.clusterName || !env.masterSecretArn || !env.database || !env.tableName || !env.tableColumns) {
    throw new Error('environment not setup');
  }
  const clusterParams = {
    clusterId: env.clusterName,
    masterSecretArn: env.masterSecretArn,
    database: env.database,
    tableName: env.tableName,
    tableColumns: JSON.parse(env.tableColumns),
  };

  if (event.RequestType === 'Create') {
    await createTable(clusterParams);
    return clusterParams.tableName;
  } else if (event.RequestType === 'Delete') {
    return; // TODO: fine to silently retain?
  } else if (event.RequestType === 'Update') {
    return { PhysicalResourceId: event.PhysicalResourceId };
  } else {
    /* eslint-disable-next-line dot-notation */
    throw new Error(`Unrecognized event type: ${event['RequestType']}`);
  }
}

async function createTable(clusterParams: ClusterParams) {
  return new Promise<{statementId: string}>(
    (resolve: (value: {statementId: string}) => void, reject: (value: unknown) => void) => {
      const tableColumns = clusterParams.tableColumns.map(column => `${column.name} ${column.dataType}`).join();
      redshiftData.executeStatement({
        ClusterIdentifier: clusterParams.clusterId ?? '',
        Database: clusterParams.database,
        SecretArn: clusterParams.masterSecretArn,
        Sql: `CREATE TABLE ${clusterParams.tableName} (${tableColumns})`,
      }, (err: Error, data: RedshiftData.ExecuteStatementOutput) => {
        if (err) {
          reject(err);
        } else {
          resolve({ statementId: data.Id ?? '' });
        }
      });
    },
  ).then(({ statementId }) => {
    return new Promise<void>(
      (resolve: (value: void) => void, reject: (value: unknown) => void) => {
        return waitForStatementComplete(statementId, () => resolve(), reject);
      },
    );
  });
}

const waitTimeout = 100;
function waitForStatementComplete(statementId: string, topResolve: () => void, topReject: (value: unknown) => void): Promise<void> {
  return new Promise((resolve: (value: void) => void) => {
    setTimeout(() => resolve(), waitTimeout);
  }).then(() => {
    return new Promise((resolve: (value: void) => void, reject: (value: unknown) => void) => {
      redshiftData.describeStatement({
        Id: statementId,
      }, (err: Error, data: RedshiftData.DescribeStatementResponse) => {
        if (err) {
          reject(err);
        } else {
          if (data.Status !== 'FINISHED' && data.Status !== 'FAILED' && data.Status !== 'ABORTED') {
            return waitForStatementComplete(statementId, topResolve, topReject);
          } else if (data.Status === 'FINISHED') {
            return resolve();
          } else {
            return reject(`Statement status was ${data.Status}: ${data.Error}`);
          }
        }
      });
    });
  }).then(() => {
    topResolve();
  }, (err) => {
    topReject(err);
  });
}
