
import { spawn } from 'child_process';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import { AtmosphereAllocation } from './atmosphere';
import { getChangedSnapshots } from './utils';

/**
 * Regions supported by the Atmosphere test accounts.
 */
export const REGIONS = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'ap-south-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-northeast-3',
  'ap-southeast-1',
  'ap-southeast-2',
  'ca-central-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-north-1',
  'sa-east-1',
];

export const deployIntegTests = async (props: {
  atmosphereRoleArn: string;
  endpoint: string;
  pool: string;
}) => {
  const batchSize = REGIONS.length;

  const changedSnapshots = await getChangedSnapshots();

  if (changedSnapshots.length === 0) {
    throw new Error('No snapshots changed, skipping deployment integ test.');
  }

  let hasFailure = false;

  for (let i = 0; i < changedSnapshots.length; i += batchSize) {
    const batch = changedSnapshots.slice(i, i + batchSize);
    const regions = REGIONS.slice(0, batch.length);
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
        AWS_REGION: 'us-east-1',
        AWS_ACCOUNT_ID: allocation.allocation.environment.account,
        TARGET_BRANCH_COMMIT: process.env.TARGET_BRANCH_COMMIT,
        SOURCE_BRANCH_COMMIT: process.env.SOURCE_BRANCH_COMMIT,
      };

      await bootstrap(env, regions);
      await deployIntegrationTest(env, batch, regions);
      outcome = 'success';
    } catch (e) {
      console.error(e);
      hasFailure = true;
    } finally {
      try {
        await allocation.release(outcome);
      } catch (e) {
        if (e instanceof Error && e.message.includes('The security token included in the request is expired')) {
          // In case of timeouts, the expired security token error can occur. We can skip the release as it will automatically be deleted.
          // Atmosphere will automatically release the resource if a timeout occurs on the backend.
          //
          // Log uses Github warning syntax, see: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#setting-a-warning-message
          console.warn(`::warning::Atmosphere allocation release failed: ${e}`);
          console.warn('Skipping release request as we assume its caused by an integ test timing out.');
        } else {
          throw e;
        }
      }
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
    DurationSeconds: 3600,
  }));

  if (response.Credentials === undefined) throw new Error('Failed to assume atmopshere role');

  return response.Credentials;
};

export const bootstrap = async (env: NodeJS.ProcessEnv, regions: string[]) => {
  console.log(`Bootstrapping ${regions.length} region(s).`);
  const spawnProcess = spawn('npx', ['cdk', 'bootstrap', ...regions.map((region) => `aws://${env.AWS_ACCOUNT_ID}/${region}`)], {
    stdio: ['ignore', 'inherit', 'inherit'],
    env,
  });

  return new Promise<void>((resolve, reject) => spawnProcess.on('close', (code) => {
    if (code == 0) resolve();
    else reject(new Error(`Account bootstrap failed with exit code ${code}`));
  }));
};

export const deployIntegrationTest = async (env: NodeJS.ProcessEnv, snapshotPaths: string[], regions: string[]) => {
  console.log(`Deploying snapshots:\n${snapshotPaths.join('\n')}`);

  const spawnProcess = spawn('npx', ['integ-runner', '--disable-update-workflow', '--strict', '--directory', 'packages', '--force', '--parallel-regions', regions.join(','), '--', ...snapshotPaths], {
    stdio: ['ignore', 'inherit', 'inherit'],
    env,
  });

  return new Promise<void>((resolve, reject) => spawnProcess.on('close', (code) => {
    if (code == 0) resolve();
    else reject(new Error(`Integration tests failed with exit code ${code}`));
  }));
};
