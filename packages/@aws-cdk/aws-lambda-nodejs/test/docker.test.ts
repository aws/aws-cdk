import { spawnSync } from 'child_process';
import * as path from 'path';

beforeAll(() => {
<<<<<<< HEAD
  spawnSync('docker', ['build', '-t', 'esbuild', path.join(__dirname, '../lib')]);
=======
  const process = spawnSync(docker, ['build', '-t', 'esbuild', path.join(__dirname, '../lib')], { stdio: 'inherit' });
  expect(process.error).toBeUndefined();
  expect(process.status).toBe(0);
>>>>>>> b1c9ab2348 (fix(lambda-nodejs): pnpm no longer supports nodejs14.x (#24821))
});

test('esbuild is available', () => {
  const proc = spawnSync('docker', [
    'run', 'esbuild',
    'esbuild', '--version',
  ]);
  expect(proc.status).toEqual(0);
});

test('can npm install with non root user', () => {
  const proc = spawnSync('docker', [
    'run', '-u', '1000:1000',
    'esbuild',
    'bash', '-c', [
      'mkdir /tmp/test',
      'cd /tmp/test',
      'npm i constructs',
    ].join(' && '),
  ]);
  expect(proc.status).toEqual(0);
});

test('can yarn install with non root user', () => {
  const proc = spawnSync('docker', [
    'run', '-u', '500:500',
    'esbuild',
    'bash', '-c', [
      'mkdir /tmp/test',
      'cd /tmp/test',
      'yarn add constructs',
    ].join(' && '),
  ]);
  expect(proc.status).toEqual(0);
});

test('can pnpm install with non root user', () => {
  const proc = spawnSync('docker', [
    'run', '-u', '500:500',
    'esbuild',
    'bash', '-c', [
      'mkdir /tmp/test',
      'cd /tmp/test',
      'pnpm add constructs',
    ].join(' && '),
  ]);
  expect(proc.status).toEqual(0);
});

test('cache folders have the right permissions', () => {
  const proc = spawnSync('docker', [
    'run', 'esbuild',
    'bash', '-c', [
      'stat -c \'%a\' /tmp/npm-cache',
      'stat -c \'%a\' /tmp/yarn-cache',
    ].join(' &&  '),
  ]);
  expect(proc.stdout.toString()).toMatch('777\n777');
});
