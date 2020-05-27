import { spawnSync } from 'child_process';
import * as path from 'path';
import { Builder } from '../lib/builder';

jest.mock('child_process', () => ({
  spawnSync: jest.fn((_cmd: string, args: string[]) => {
    if (args.includes('/project/folder/error')) {
      return { error: 'parcel-error' };
    }

    if (args.includes('/project/folder/status')) {
      return { status: 1, stdout: Buffer.from('status-error') };
    }

    if (args.includes('/project/folder/no-docker')) {
      return { error: 'Error: spawnSync docker ENOENT' };
    }

    return { error: null, status: 0 };
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('calls docker with the correct args', () => {
  const builder = new Builder({
    entry: '/project/folder/entry.ts',
    global: 'handler',
    outDir: '/out-dir',
    cacheDir: '/cache-dir',
    nodeDockerTag: 'lts-alpine',
    nodeVersion: '12',
    projectRoot: '/project',
  });
  builder.build();

  // docker build
  expect(spawnSync).toHaveBeenNthCalledWith(1, 'docker', [
    'build', '--build-arg', 'NODE_TAG=lts-alpine', '-t', 'parcel-bundler', path.join(__dirname, '../parcel-bundler'),
  ]);

  // docker run
  expect(spawnSync).toHaveBeenNthCalledWith(2, 'docker', [
    'run', '--rm',
    '-v', '/project:/project',
    '-v', '/out-dir:/out',
    '-v', '/cache-dir:/cache',
    '-w', '/project/folder',
    'parcel-bundler',
    'parcel', 'build', '/project/folder/entry.ts',
    '--out-dir', '/out',
    '--out-file', 'index.js',
    '--global', 'handler',
    '--target', 'node',
    '--bundle-node-modules',
    '--log-level', '2',
    '--no-minify',
    '--no-source-maps',
    '--cache-dir', '/cache',
  ]);
});

test('with Windows paths', () => {
  const builder = new Builder({
    entry: 'C:\\my-project\\lib\\entry.ts',
    global: 'handler',
    outDir: '/out-dir',
    cacheDir: '/cache-dir',
    nodeDockerTag: 'lts-alpine',
    nodeVersion: '12',
    projectRoot: 'C:\\my-project',
  });
  builder.build();

  // docker run
  expect(spawnSync).toHaveBeenCalledWith('docker', expect.arrayContaining([
    'parcel', 'build', expect.stringContaining('/lib/entry.ts'),
  ]));
});

test('throws in case of error', () => {
  const builder = new Builder({
    entry: '/project/folder/error',
    global: 'handler',
    outDir: 'out-dir',
    nodeDockerTag: 'lts-alpine',
    nodeVersion: '12',
    projectRoot: '/project',
  });
  expect(() => builder.build()).toThrow('parcel-error');
});

test('throws if status is not 0', () => {
  const builder = new Builder({
    entry: '/project/folder/status',
    global: 'handler',
    outDir: 'out-dir',
    nodeDockerTag: 'lts-alpine',
    nodeVersion: '12',
    projectRoot: '/project',
  });
  expect(() => builder.build()).toThrow('status-error');
});

test('throws if docker is not installed', () => {
  const builder = new Builder({
    entry: '/project/folder/no-docker',
    global: 'handler',
    outDir: 'out-dir',
    nodeDockerTag: 'lts-alpine',
    nodeVersion: '12',
    projectRoot: '/project',
  });
  expect(() => builder.build()).toThrow('Error: spawnSync docker ENOENT');
});
