/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as RedshiftData from 'aws-sdk/clients/redshiftdata';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as SecretsManager from 'aws-sdk/clients/secretsmanager';
import { ClusterParams, getClusterParamsFromEnv, waitForStatementComplete } from './util';

const redshiftData = new RedshiftData();
const secretsManager = new SecretsManager();

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  if (!process.env.userSecretArn) {
    throw new Error('Environment not setup, must provide value for userSecretArn');
  }
  const userSecretArn = process.env.userSecretArn;
  const clusterParams = getClusterParamsFromEnv();

  if (event.RequestType === 'Create') {
    const username = await createUser(clusterParams, userSecretArn);
    return { PhysicalResourceId: username };
  } else if (event.RequestType === 'Delete') {
    return deleteUser(clusterParams, event.PhysicalResourceId);
  } else if (event.RequestType === 'Update') {
    return { PhysicalResourceId: event.PhysicalResourceId };
  } else {
    /* eslint-disable-next-line dot-notation */
    throw new Error(`Unrecognized event type: ${event['RequestType']}`);
  }
}

async function deleteUser(clusterParams: ClusterParams, username: string) {
  const revokeStatement = await redshiftData.executeStatement({
    ClusterIdentifier: clusterParams.clusterId,
    Database: clusterParams.database,
    SecretArn: clusterParams.masterSecretArn,
    Sql: `REVOKE INSERT ON ${clusterParams.tableName} FROM ${username}`,
  }).promise();
  await waitForStatementComplete(revokeStatement.Id);
  const dropStatement = await redshiftData.executeStatement({
    ClusterIdentifier: clusterParams.clusterId,
    Database: clusterParams.database,
    SecretArn: clusterParams.masterSecretArn,
    Sql: `DROP USER ${username}`,
  }).promise();
  await waitForStatementComplete(dropStatement.Id);
}

async function createUser(clusterParams: ClusterParams, userSecretArn: string): Promise<string> {
  const secretValue = await secretsManager.getSecretValue({
    SecretId: userSecretArn,
  }).promise();
  const secretString = secretValue.SecretString;
  if (!secretString) {
    throw new Error(`Secret string for ${userSecretArn} was empty`);
  }
  const { username, password } = JSON.parse(secretString);
  const createStatement = await redshiftData.executeStatement({
    ClusterIdentifier: clusterParams.clusterId,
    Database: clusterParams.database,
    SecretArn: clusterParams.masterSecretArn,
    Sql: `CREATE USER ${username} PASSWORD '${password}'`,
  }).promise();
  await waitForStatementComplete(createStatement.Id);
  const grantStatement = await redshiftData.executeStatement({
    ClusterIdentifier: clusterParams.clusterId,
    Database: clusterParams.database,
    SecretArn: clusterParams.masterSecretArn,
    Sql: `GRANT INSERT ON ${clusterParams.tableName} TO ${username}`,
  }).promise();
  await waitForStatementComplete(grantStatement.Id);
  return username;
}
