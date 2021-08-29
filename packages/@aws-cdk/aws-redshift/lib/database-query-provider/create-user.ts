/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as SecretsManager from 'aws-sdk/clients/secretsmanager';
import { ClusterProps, executeStatement, getClusterPropsFromEvent, getResourceProperty, makePhysicalId } from './util';

const secretsManager = new SecretsManager();

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const username = getResourceProperty('username', event.ResourceProperties);
  const passwordSecretArn = getResourceProperty('passwordSecretArn', event.ResourceProperties);
  const clusterProps = getClusterPropsFromEvent(event.ResourceProperties);

  if (event.RequestType === 'Create') {
    await createUser(username, passwordSecretArn, clusterProps);
    return { PhysicalResourceId: makePhysicalId(username, clusterProps), Data: { username: username } };
  } else if (event.RequestType === 'Delete') {
    await dropUser(username, clusterProps);
    return;
  } else if (event.RequestType === 'Update') {
    await updateUser(username, passwordSecretArn, clusterProps, event.OldResourceProperties);
    return { PhysicalResourceId: makePhysicalId(username, clusterProps), Data: { username: username } };
  } else {
    /* eslint-disable-next-line dot-notation */
    throw new Error(`Unrecognized event type: ${event['RequestType']}`);
  }
}

async function dropUser(username: string, clusterProps: ClusterProps) {
  await executeStatement(`DROP USER ${username}`, clusterProps);
}

async function createUser(username: string, passwordSecretArn: string, clusterProps: ClusterProps) {
  const password = await getPasswordFromSecret(passwordSecretArn);

  await executeStatement(`CREATE USER ${username} PASSWORD '${password}'`, clusterProps);
}

async function updateUser(username: string, passwordSecretArn: string, clusterProps: ClusterProps, oldResourceProperties: { [Key: string]: any }) {
  const oldClusterProps = getClusterPropsFromEvent(oldResourceProperties);
  if (clusterProps !== oldClusterProps) {
    await createUser(username, passwordSecretArn, clusterProps);
    return;
  }

  const oldUsername = getResourceProperty('username', oldResourceProperties);
  const oldPasswordSecretArn = getResourceProperty('passwordSecretArn', oldResourceProperties);
  const oldPassword = await getPasswordFromSecret(oldPasswordSecretArn);
  const password = await getPasswordFromSecret(passwordSecretArn);

  if (username !== oldUsername) {
    await createUser(username, passwordSecretArn, clusterProps);
    return;
  }

  if (password !== oldPassword) {
    await executeStatement(`ALTER USER ${username} PASSWORD ${password}`, clusterProps);
  }
}

async function getPasswordFromSecret(passwordSecretArn: string): Promise<string> {
  const secretValue = await secretsManager.getSecretValue({
    SecretId: passwordSecretArn,
  }).promise();
  const secretString = secretValue.SecretString;
  if (!secretString) {
    throw new Error(`Secret string for ${passwordSecretArn} was empty`);
  }
  const { password } = JSON.parse(secretString);

  return password;
}
