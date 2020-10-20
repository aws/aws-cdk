import { spawnSync } from 'child_process';

beforeAll(() => {
  spawnSync('docker', ['build', '-t', 'golang', __dirname]);
});

test('golang is available', async () => {
  const proc = spawnSync('docker', [
    'run', 'golang',
    'sh', '-c',
    'go version',
  ]);
  expect(proc.status).toEqual(0);
});
