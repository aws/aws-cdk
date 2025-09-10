import { spawn } from 'child_process';

export const gitDiff = async (): Promise<string> => {
  const spawnProcess = spawn('git', ['diff', process.env.BASE_COMMIT ?? 'main', process.env.HEAD_COMMIT ?? 'HEAD', '--name-only'], {
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
