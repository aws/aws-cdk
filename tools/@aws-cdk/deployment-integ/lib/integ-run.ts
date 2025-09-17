import { Allocation } from '@cdklabs/cdk-atmosphere-client';
import { spawn } from 'child_process';
import { AtmosphereAllocation } from './atmosphere';
import { getChangedSnapshots } from './utils';

export const deployInegTestsWithAtmosphere = async ({ endpoint, pool }: {endpoint: string; pool: string}) => {
  const allocation = await AtmosphereAllocation.acquire({ endpoint, pool });
  let outcome = 'failure';

  try {
    const changedSnapshots = await getChangedSnapshots();
    console.log(`Detected changed snapshots:\n${changedSnapshots.join('\n')}`);
    await runInteg(changedSnapshots, allocation.allocation);
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

export const runInteg = async (paths: string[], allocation: Allocation) => {
  if (paths.length == 0) {
    console.log('No snapshots changes were made, skipping deployment integ test.');
    return;
  }

  const spawnProcess = spawn('yarn', ['integ-runner', '--directory', 'packages', '--force', ...paths], {
    stdio: ['ignore', 'inherit', 'inherit'],
    env: {
      ...process.env,
      AWS_ACCESS_KEY_ID: allocation.credentials.accessKeyId,
      AWS_SECRET_ACCESS_KEY: allocation.credentials.secretAccessKey,
      AWS_SESSION_TOKEN: allocation.credentials.sessionToken,
      AWS_REGION: allocation.environment.region,
      AWS_ACCOUNT_ID: allocation.environment.account,
    },
  });

  return new Promise<void>((resolve, reject) => spawnProcess.on('close', (code) => {
    if (code == 0) resolve();
    else reject(new Error(`Integration tests failed with exit code ${code}`));
  }));
};
