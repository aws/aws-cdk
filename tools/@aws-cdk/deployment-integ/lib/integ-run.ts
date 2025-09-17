import { spawn } from 'child_process';
import { AtmosphereAllocation } from './atmosphere';
import { getChangedSnapshots } from './utils';

export const deployInegTestsWithAtmosphere = async ({ endpoint, pool }: {endpoint: string; pool: string}) => {
  const allocation = await AtmosphereAllocation.acquire({ endpoint, pool });
  let outcome = 'failure';

  try {
    // Set credentials in environment
    process.env.AWS_ACCESS_KEY_ID = allocation.allocation.credentials.accessKeyId;
    process.env.AWS_SECRET_ACCESS_KEY = allocation.allocation.credentials.secretAccessKey;
    process.env.AWS_SESSION_TOKEN = allocation.allocation.credentials.sessionToken;
    process.env.AWS_REGION = allocation.allocation.environment.region;
    process.env.AWS_ACCOUNT_ID = allocation.allocation.environment.account;

    await runInteg();
    outcome = 'success';
  } catch (e) {
    console.error(e);
  } finally {
    await allocation.release(outcome);
  }

  if (outcome == 'failure') {
    throw Error('Deployment integration test did not pass');
  }
};

export const runInteg = async () => {
  const changedSnapshotPaths = await getChangedSnapshots();
  console.log(`Detected changed snapshots:\n${changedSnapshotPaths.join('\n')}`);

  if (changedSnapshotPaths.length == 0) {
    console.log('No snapshots changes were made, skipping deployment integ test.');
    return;
  }

  const spawnProcess = spawn('yarn', ['integ-runner', '--directory', 'packages', '--force', ...changedSnapshotPaths], {
    stdio: ['ignore', 'inherit', 'inherit'],
    env: {
      ...process.env,
    },
  });

  return new Promise<void>((resolve, reject) => spawnProcess.on('close', (code) => {
    if (code == 0) resolve();
    else reject(new Error(`Integration tests failed with exit code ${code}`));
  }));
};
