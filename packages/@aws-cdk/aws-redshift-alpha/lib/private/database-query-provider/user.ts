/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as SecretsManager from 'aws-sdk/clients/secretsmanager';
import { executeStatement } from './redshift-data';
import { ClusterProps } from './types';
import { makePhysicalId } from './util';
import { UserHandlerProps } from '../handler-props';

const secretsManager = new SecretsManager();

export async function handler(props: UserHandlerProps & ClusterProps, event: AWSLambda.CloudFormationCustomResourceEvent) {
  const username = props.username;
  const passwordSecretArn = props.passwordSecretArn;
  const clusterProps = props;

  if (event.RequestType === 'Create') {
    await createUser(username, passwordSecretArn, clusterProps);
    return { PhysicalResourceId: makePhysicalId(username, clusterProps, event.RequestId), Data: { username: username } };
  } else if (event.RequestType === 'Delete') {
    await dropUser(username, clusterProps);
    return;
  } else if (event.RequestType === 'Update') {
    const { replace } = await updateUser(username, passwordSecretArn, clusterProps, event.OldResourceProperties as UserHandlerProps & ClusterProps);
    const physicalId = replace ? makePhysicalId(username, clusterProps, event.RequestId) : event.PhysicalResourceId;
    return { PhysicalResourceId: physicalId, Data: { username: username } };
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

async function updateUser(
  username: string,
  passwordSecretArn: string,
  clusterProps: ClusterProps,
  oldResourceProperties: UserHandlerProps & ClusterProps,
): Promise<{ replace: boolean }> {
  const oldClusterProps = oldResourceProperties;
  if (clusterProps.clusterName !== oldClusterProps.clusterName || clusterProps.databaseName !== oldClusterProps.databaseName) {
    await createUser(username, passwordSecretArn, clusterProps);
    return { replace: true };
  }

  const oldUsername = oldResourceProperties.username;
  const oldPasswordSecretArn = oldResourceProperties.passwordSecretArn;
  const oldPassword = await getPasswordFromSecret(oldPasswordSecretArn);
  const password = await getPasswordFromSecret(passwordSecretArn);

  if (username !== oldUsername) {
    await createUser(username, passwordSecretArn, clusterProps);
    return { replace: true };
  }

  if (password !== oldPassword) {
    await executeStatement(`ALTER USER ${username} PASSWORD '${password}'`, clusterProps);
    return { replace: false };
  }

  return { replace: false };
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
