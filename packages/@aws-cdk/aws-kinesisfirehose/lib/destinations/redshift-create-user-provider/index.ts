/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as RedshiftData from 'aws-sdk/clients/redshiftdata';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as SecretsManager from 'aws-sdk/clients/secretsmanager';

const redshiftData = new RedshiftData();
const secretsManager = new SecretsManager();

interface ClusterParams {
  clusterId: string;
  masterSecretArn: string;
  database: string;
  table: string;
}

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const env = process.env;
  if (!env.clusterName || !env.masterSecretArn || !env.database || !env.table) {
    throw new Error('environment not setup');
  }
  const clusterParams = {
    clusterId: env.clusterName,
    masterSecretArn: env.masterSecretArn,
    database: env.database,
    table: env.table,
  };

  if (event.RequestType === 'Create') {
    const { username } = await createUser(clusterParams, env.userSecretArn ?? '');
    return { PhysicalResourceId: username };
  } else if (event.RequestType === 'Delete') {
    return deleteUser(env, event.PhysicalResourceId);
  } else if (event.RequestType === 'Update') {
    return { PhysicalResourceId: event.PhysicalResourceId };
  } else {
    throw new Error(`Unrecognized event type: ${event['RequestType']}`);
  }
}

async function deleteUser(env: NodeJS.ProcessEnv, username: string) {
  return new Promise<{ statementId: string }>((resolve: (value: { statementId: string }) => void, reject: (value: unknown) => void) => {
    redshiftData.executeStatement({
      ClusterIdentifier: env.clusterName ?? '',
      Database: env.database,
      SecretArn: env.masterSecretArn,
      Sql: `DROP USER ${username}`,
      // TODO: must revoke permissions first
    }, (err: Error, data: RedshiftData.ExecuteStatementOutput) => {
      if (err) {
        // TODO: catch user does not exist?
        reject(err);
      } else {
        resolve({ statementId: data.Id ?? '' });
      }
    });
  }).then(({ statementId }) => {
    return new Promise<void>((resolve: () => void, reject: (value: unknown) => void) => {
      return waitForStatementComplete(statementId, resolve, reject);
    });
  });
}

async function createUser(clusterParams: ClusterParams, userSecretArn: string) {
  return new Promise<{ username: string, password: string }>(
    (resolve: (value: { username: string, password: string }) => void, reject: (value: unknown) => void) => {
      secretsManager.getSecretValue({
        SecretId: userSecretArn ?? '',
      }, (err: Error, data: SecretsManager.GetSecretValueResponse) => {
        if (err) {
          reject(err);
        } else {
          const secretString = data.SecretString ?? '';
          const secretObject = JSON.parse(secretString);
          resolve({ username: secretObject.username, password: secretObject.password });
        }
      });
    },
  ).then(({ username, password }) => {
    return new Promise<{ statementId: string, username: string }>(
      (resolve: (value: { statementId: string, username: string }) => void, reject: (value: unknown) => void) => {
        redshiftData.executeStatement({
          ClusterIdentifier: clusterParams.clusterId ?? '',
          Database: clusterParams.database,
          SecretArn: clusterParams.masterSecretArn,
          Sql: `CREATE USER ${username} PASSWORD '${password}'`,
        }, (err: Error, data: RedshiftData.ExecuteStatementOutput) => {
          if (err) {
            reject(err);
          } else {
            resolve({ statementId: data.Id ?? '', username });
          }
        });
      },
    );
  }).then(({ statementId, username }) => {
    return new Promise<{ username: string }>(
      (resolve: (value: { username: string }) => void, reject: (value: unknown) => void) => {
        const resolveUsername = () => resolve({ username });
        return waitForStatementComplete(statementId, resolveUsername, reject);
      },
    );
  }).then(({ username }) => {
    return new Promise<{ statementId: string, username: string }>(
      (resolve: (value: { statementId: string, username: string }) => void, reject: (value: unknown) => void) => {
        redshiftData.executeStatement({
          ClusterIdentifier: clusterParams.clusterId ?? '',
          Database: clusterParams.database,
          SecretArn: clusterParams.masterSecretArn,
          Sql: `GRANT INSERT ON ${clusterParams.table} TO ${username}`,
        }, (err: Error, data: RedshiftData.ExecuteStatementOutput) => {
          if (err) {
            reject(err);
          } else {
            resolve({ statementId: data.Id ?? '', username });
          }
        });
      },
    );
  }).then(({ statementId, username }) => {
    return new Promise<{ username: string }>(
      (resolve: (value: { username: string }) => void, reject: (value: unknown) => void) => {
        const resolveUsername = () => resolve({ username });
        return waitForStatementComplete(statementId, resolveUsername, reject);
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
