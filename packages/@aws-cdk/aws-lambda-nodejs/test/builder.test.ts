import * as lambda from '@aws-cdk/aws-lambda';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Builder } from '../lib/builder';

const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'out-dir'));

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

    if (args.includes('--out-dir')) {
      const dir = args.find(arg => arg.endsWith(':/out'))?.split(':')[0];
      require('fs-extra').ensureDirSync(dir); // eslint-disable-line @typescript-eslint/no-require-imports
    }

    return { error: null, status: 0 };
  }),
}));

jest.spyOn(fs, 'writeFileSync');
jest.spyOn(fs, 'copyFileSync');

test('calls docker with the correct args', () => {
  const builder = new Builder({
    entry: '/project/folder/entry.ts',
    global: 'handler',
    outDir,
    cacheDir: '/cache-dir',
    runtime: lambda.Runtime.NODEJS_12_X,
    projectRoot: '/project',
  });
  builder.build();

  // docker build
  expect(spawnSync).toHaveBeenNthCalledWith(1, 'docker', [
    'build',
    '--build-arg', 'LAMBCI_LAMBDA_TAG=build-nodejs12.x',
    '-t', 'parcel-bundler',
    path.join(__dirname, '../parcel-bundler'),
  ]);

  // docker run
  expect(spawnSync).toHaveBeenNthCalledWith(2, 'docker', [
    'run', '--rm',
    '-v', '/project:/project',
    '-v', `${outDir}:/out`,
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

test('with external modules', () => {
  const builder = new Builder({
    entry: '/project/folder/entry.ts',
    global: 'handler',
    outDir: 'out-dir',
    runtime: lambda.Runtime.NODEJS_12_X,
    projectRoot: '/project',
    externalModules: ['aws-sdk'],
  });
  builder.build();

  expect(fs.writeFileSync).toHaveBeenCalledWith(
    expect.stringMatching(/package\.json$/),
    expect.stringMatching(/externals[\s\S]+aws-sdk/),
  );
});

test('with install modules', () => {
  const builder = new Builder({
    entry: '/project/folder/entry.ts',
    global: 'handler',
    outDir,
    runtime: lambda.Runtime.NODEJS_12_X,
    projectRoot: '/project',
    installModules: ['fs-extra'],
  });
  builder.build();

  expect(fs.writeFileSync).toHaveBeenCalledWith(
    path.join(outDir, 'package.json'),
    expect.stringMatching('fs-extra'),
  );

  expect(spawnSync).toHaveBeenCalledWith('docker', [
    'run', '--rm',
    '-v', `${outDir}:/var/task`,
    'parcel-bundler',
    'npm', 'install', '--production',
  ]);
});

test('should use yarn with a yarn.lock', () => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'project-root'));
  const lockFile = path.join(projectRoot, 'yarn.lock');
  fs.writeFileSync(lockFile, 'LOCK FILE');

  const builder = new Builder({
    entry: '/project/folder/entry.ts',
    global: 'handler',
    outDir,
    runtime: lambda.Runtime.NODEJS_12_X,
    projectRoot,
    installModules: ['fs-extra'],
  });
  builder.build();

  expect(fs.copyFileSync).toHaveBeenCalledWith(
    lockFile,
    path.join(outDir, 'yarn.lock'),
  );

  expect(spawnSync).toHaveBeenCalledWith('docker', [
    'run', '--rm',
    '-v', `${outDir}:/var/task`,
    'parcel-bundler',
    'yarn', 'install', '--production',
  ]);
});

test('throws with unknown module to install', () => {
  const builder = new Builder({
    entry: '/project/folder/entry.ts',
    global: 'handler',
    outDir,
    runtime: lambda.Runtime.NODEJS_12_X,
    projectRoot: '/project',
    installModules: ['unknown-module'],
  });

  expect(() => builder.build()).toThrow(/Module 'unknown-module' must be listed in the project dependencies/);
});

test('throws in case of error', () => {
  const builder = new Builder({
    entry: '/project/folder/error',
    global: 'handler',
    outDir,
    runtime: lambda.Runtime.NODEJS_12_X,
    projectRoot: '/project',
  });
  expect(() => builder.build()).toThrow('parcel-error');
});

test('throws if status is not 0', () => {
  const builder = new Builder({
    entry: '/project/folder/status',
    global: 'handler',
    outDir,
    runtime: lambda.Runtime.NODEJS_12_X,
    projectRoot: '/project',
  });
  expect(() => builder.build()).toThrow('status-error');
});

test('throws if docker is not installed', () => {
  const builder = new Builder({
    entry: '/project/folder/no-docker',
    global: 'handler',
    outDir,
    runtime: lambda.Runtime.NODEJS_12_X,
    projectRoot: '/project',
  });
  expect(() => builder.build()).toThrow('Error: spawnSync docker ENOENT');
});
