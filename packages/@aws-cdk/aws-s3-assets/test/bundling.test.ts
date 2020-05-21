import { Stack } from '@aws-cdk/core';
import { spawnSync } from 'child_process';
import * as path from 'path';
import * as assets from '../lib';

const SAMPLE_ASSET_DIR = path.join(__dirname, 'sample-asset-directory');

jest.mock('child_process');

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('bundling with image from registry', () => {
  (spawnSync as jest.Mock).mockImplementation((): ReturnType<typeof spawnSync> => ({
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('stdout'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  }));

  const command = ['this', 'is', 'a', 'build', 'command'];
  const image = 'alpine';
  new assets.Asset(stack, 'Asset', {
    path: SAMPLE_ASSET_DIR,
    bundling: {
      image: assets.BundlingDockerImage.fromRegistry(image),
      environment: {
        VAR1: 'value1',
        VAR2: 'value2',
      },
      command,
    },
  });

  expect(spawnSync).toHaveBeenCalledWith('docker', [
    'run', '--rm',
    '-v', `${SAMPLE_ASSET_DIR}:/asset-input`,
    '-v', expect.stringMatching(new RegExp(`${path.join('.bundle', path.basename(SAMPLE_ASSET_DIR))}:/asset-output$`)),
    '--env', 'VAR1=value1',
    '--env', 'VAR2=value2',
    '-w', '/asset-input',
    image,
    ...command,
  ]);
});

test('bundling with image from asset', () => {
  const imageId = 'abcdef123456';
  (spawnSync as jest.Mock).mockImplementation((): ReturnType<typeof spawnSync> => ({
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from(`Successfully built ${imageId}`),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  }));

  const dockerPath = 'docker-path';
  const testArg = 'cdk-test';
  new assets.Asset(stack, 'Asset', {
    path: SAMPLE_ASSET_DIR,
    bundling: {
      image: assets.BundlingDockerImage.fromAsset(dockerPath, {
        buildArgs: {
          TEST_ARG: testArg,
        },
      }),
    },
  });

  expect(spawnSync).toHaveBeenCalledWith('docker', [
    'build',
    '--build-arg', `TEST_ARG=${testArg}`,
    dockerPath,
  ]);

  expect(spawnSync).toHaveBeenCalledWith('docker', expect.arrayContaining([
    imageId,
  ]));
});

test('throws if image id cannot be extracted from build output', () => {
  (spawnSync as jest.Mock).mockImplementation((): ReturnType<typeof spawnSync> => ({
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('stdout'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  }));

  const dockerPath = 'docker-path';
  expect(() => new assets.Asset(stack, 'Asset', {
    path: SAMPLE_ASSET_DIR,
    bundling: {
      image: assets.BundlingDockerImage.fromAsset(dockerPath),
    },
  })).toThrow(/Failed to extract image ID from Docker build output/);
});

test('throws in case of spawnSync error', () => {
  const spawnSyncError = new Error('UnknownError');
  (spawnSync as jest.Mock).mockImplementation((): ReturnType<typeof spawnSync> => ({
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('stdout'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
    error: spawnSyncError,
  }));

  expect(() => new assets.Asset(stack, 'Asset', {
    path: SAMPLE_ASSET_DIR,
    bundling: {
      image: assets.BundlingDockerImage.fromRegistry('alpine'),
    },
  })).toThrow(spawnSyncError);
});

test('throws if status is not 0', () => {
  (spawnSync as jest.Mock).mockImplementation((): ReturnType<typeof spawnSync> => ({
    status: -1,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('stdout'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  }));

  expect(() => new assets.Asset(stack, 'Asset', {
    path: SAMPLE_ASSET_DIR,
    bundling: {
      image: assets.BundlingDockerImage.fromRegistry('alpine'),
    },
  })).toThrow(/^\[Status -1\]/);
});
