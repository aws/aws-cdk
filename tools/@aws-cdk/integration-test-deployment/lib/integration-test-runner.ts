import { spawn } from 'child_process';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import { AtmosphereAllocation } from './atmosphere';
import { getChangedSnapshots } from './utils';

export const deployIntegTests = async (props: {
  atmosphereRoleArn: string;
  endpoint: string;
  pool: string;
  batchSize?: number;
}) => {
  const batchSize = props.batchSize ?? 3;

  const changedSnapshots = await getChangedSnapshots();

  if (changedSnapshots.length === 0) {
    throw new Error('No snapshots changed, skipping deployment integ test.');
  }

  let hasFailure = false;

  for (let i = 0; i < changedSnapshots.length; i += batchSize) {
    const batch = changedSnapshots.slice(i, i + batchSize);
    const creds = await assumeAtmosphereRole(props.atmosphereRoleArn);
    const allocation = await AtmosphereAllocation.acquire({
      endpoint: props.endpoint,
      pool: props.pool,
      creds: {
        accessKeyId: creds.AccessKeyId!,
        secretAccessKey: creds.SecretAccessKey!,
        sessionToken: creds.SessionToken!,
      },
    });
    let outcome = 'failure';

    try {
      const env = {
        PATH: process.env.PATH, // Allows the spawn process to find the yarn binary.
        AWS_ACCESS_KEY_ID: allocation.allocation.credentials.accessKeyId,
        AWS_SECRET_ACCESS_KEY: allocation.allocation.credentials.secretAccessKey,
        AWS_SESSION_TOKEN: allocation.allocation.credentials.sessionToken,
        AWS_REGION: allocation.allocation.environment.region,
        AWS_ACCOUNT_ID: allocation.allocation.environment.account,
        TARGET_BRANCH_COMMIT: process.env.TARGET_BRANCH_COMMIT,
        SOURCE_BRANCH_COMMIT: process.env.SOURCE_BRANCH_COMMIT,
      };

      await bootstrap(env);
      await deployIntegrationTest(env, batch);
      outcome = 'success';
    } catch (e) {
      console.error(e);
      hasFailure = true;
    } finally {
      await allocation.release(outcome);
    }
  }

  if (hasFailure) {
    throw Error('Deployment integration test did not pass');
  }
};

export const assumeAtmosphereRole = async (roleArn: string) => {
  const sts = new STSClient({});
  const response = await sts.send(new AssumeRoleCommand({
    RoleArn: roleArn,
    RoleSessionName: 'run-tests@aws-cdk-deployment-integ',
    DurationSeconds: 3600
  }));

  if (response.Credentials === undefined) throw new Error('Failed to assume atmopshere role');

  return response.Credentials;
};

export const bootstrap = async (env: NodeJS.ProcessEnv) => {
  console.log('Bootstrapping AWS account.');
  const spawnProcess = spawn('npx', ['cdk', 'bootstrap', ...['us-east-1', 'us-east-2', 'us-west-2'].map((region) => `aws://${env.AWS_ACCOUNT_ID}/${region}`)], {
    stdio: ['ignore', 'inherit', 'inherit'],
    env,
  });

  return new Promise<void>((resolve, reject) => spawnProcess.on('close', (code) => {
    if (code == 0) resolve();
    else reject(new Error(`Account bootstrap failed with exit code ${code}`));
  }));
};

export const deployIntegrationTest = async (env: NodeJS.ProcessEnv, snapshotPaths: string[]) => {
  console.log(`Deploying snapshots:\n${snapshotPaths.join('\n')}`);

  const spawnProcess = spawn('yarn', ['integ-runner', '--disable-update-workflow', '--strict', '--directory', 'packages', '--force', ...snapshotPaths], {
    stdio: ['ignore', 'inherit', 'inherit'],
    env,
  });

  return new Promise<void>((resolve, reject) => spawnProcess.on('close', (code) => {
    if (code == 0) resolve();
    else reject(new Error(`Integration tests failed with exit code ${code}`));
  }));
};
