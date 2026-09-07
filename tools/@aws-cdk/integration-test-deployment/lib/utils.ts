
import { spawn } from 'child_process';

export const gitDiff = async (): Promise<string> => {
  if (!process.env.TARGET_BRANCH_COMMIT || !process.env.SOURCE_BRANCH_COMMIT) throw new Error('Environment variables TARGET_BRANCH_COMMIT and SOURCE_BRANCH_COMMIT were not set');

  const spawnProcess = spawn('git', ['diff', `${process.env.TARGET_BRANCH_COMMIT}...${process.env.SOURCE_BRANCH_COMMIT}`, '--name-only'], {
    stdio: ['ignore', 'pipe', 'inherit'],
  });

  let output = '';
  spawnProcess.stdout.on('data', (data) => output += data);

  return new Promise((resolve, reject) => spawnProcess.on('close', (code) => {
    console.log(`git diff output:\n${output}`);
    if (code == 0) resolve(output);
    else reject(`git diff process failed with exit code ${code}`);
  }));
};

// Get file paths for .integ.*.js files that were modified between the source and target branches
export const getChangedSnapshots = async (): Promise<string[]> => [
  ...new Set(
    (await gitDiff()).split('\n')
      .map(val => {
        const match = val.match(/^.*integ\.[^/]*\.js/);
        return match ? match[0].replace(/(\.js).*$/, '$1') : null;
      })
      .filter(val => val !== null),
  ),
];
