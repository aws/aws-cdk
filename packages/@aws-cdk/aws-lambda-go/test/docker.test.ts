import { spawnSync } from 'child_process';
import * as path from 'path';

beforeAll(() => {
  spawnSync('docker', ['build', '--build-arg', 'IMAGE=public.ecr.aws/bitnami/golang:1.15', '-t', 'golang', path.join(__dirname, '../lib')]);
});

test('golang is available', async () => {
  const proc = spawnSync('docker', [
    'run', 'golang',
    'sh', '-c',
    'go version',
  ]);
  expect(proc.status).toEqual(0);
});
