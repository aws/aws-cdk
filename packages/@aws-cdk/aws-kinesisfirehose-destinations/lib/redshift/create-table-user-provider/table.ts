/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as RedshiftData from 'aws-sdk/clients/redshiftdata';
import { ClusterParams, getClusterParamsFromEnv, waitForStatementComplete } from './util';

const redshiftData = new RedshiftData();

interface Column {
  name: string;
  dataType: string;
}

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  if (!process.env.tableColumns) {
    throw new Error('Environment not setup, must provide value for tableColumns');
  }
  const tableColumns = JSON.parse(process.env.tableColumns);
  const clusterParams = getClusterParamsFromEnv();

  if (event.RequestType === 'Create') {
    await createTable(clusterParams, tableColumns);
    return { PhysicalResourceId: clusterParams.tableName };
  } else if (event.RequestType === 'Delete') {
    /* eslint-disable-next-line no-console */
    console.log('Received Delete event, no-op to avoid data loss');
    return;
  } else if (event.RequestType === 'Update') {
    return { PhysicalResourceId: event.PhysicalResourceId };
  } else {
    /* eslint-disable-next-line dot-notation */
    throw new Error(`Unrecognized event type: ${event['RequestType']}`);
  }
}

async function createTable(clusterParams: ClusterParams, tableColumns: Column[]) {
  const tableColumnsString = tableColumns.map(column => `${column.name} ${column.dataType}`).join();
  const createStatement = await redshiftData.executeStatement({
    ClusterIdentifier: clusterParams.clusterId,
    Database: clusterParams.database,
    SecretArn: clusterParams.adminUserArn,
    Sql: `CREATE TABLE ${clusterParams.tableName} (${tableColumnsString})`,
  }).promise();

  await waitForStatementComplete(createStatement.Id);
}
