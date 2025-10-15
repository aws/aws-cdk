import { spawn } from 'child_process';
import { AtmosphereAllocation } from './atmosphere';
import { getChangedSnapshots } from './utils';

export const deployInegTestsWithAtmosphere = async ({ endpoint, pool }: {endpoint: string; pool: string}) => {
  const allocation = await AtmosphereAllocation.acquire({ endpoint, pool });
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

    await deployIntegrationTests(env);
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

export const deployIntegrationTests = async (env: NodeJS.ProcessEnv) => {
  const changedSnapshotPaths = await getChangedSnapshots();
  console.log(`Detected changed snapshots:\n${changedSnapshotPaths.join('\n')}`);

  if (changedSnapshotPaths.length == 0) {
    throw new Error('No snapshots changed, skipping deployment integ test.');
  }

  const spawnProcess = spawn('yarn', ['integ-runner', '--directory', 'packages', '--force', ...changedSnapshotPaths], {
    stdio: ['ignore', 'inherit', 'inherit'],
    env,
  });

  return new Promise<void>((resolve, reject) => spawnProcess.on('close', (code) => {
    if (code == 0) resolve();
    else reject(new Error(`Integration tests failed with exit code ${code}`));
  }));
};
