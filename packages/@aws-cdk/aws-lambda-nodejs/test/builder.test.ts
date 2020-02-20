import { spawnSync } from 'child_process';
import * as fs from 'fs';
import { Builder } from '../lib/builder';

let parcelPkgPath: string;
let parcelPkg: Buffer;
beforeAll(() => {
  parcelPkgPath = require.resolve('parcel-bundler/package.json');
  parcelPkg = fs.readFileSync(parcelPkgPath);
});

afterEach(() => {
  fs.writeFileSync(parcelPkgPath, parcelPkg);
});

jest.mock('child_process', () => ({
  spawnSync: jest.fn((_cmd: string, args: string[]) => {
    if (args[1] === 'error') {
      return { error: 'parcel-error' };
    }

    if (args[1] === 'status') {
      return { status: 1, stdout: Buffer.from('status-error') };
    }

    return { error: null, status: 0 };
  })
}));

test('calls parcel with the correct args', () => {
  const builder = new Builder({
    entry: 'entry',
    global: 'handler',
    outDir: 'out-dir',
    cacheDir: 'cache-dir',
  });
  builder.build();

  expect(spawnSync).toHaveBeenCalledWith(expect.stringContaining('parcel-bundler'), expect.arrayContaining([
    'build', 'entry',
    '--out-dir', 'out-dir',
    '--out-file', 'index.js',
    '--global', 'handler',
    '--target', 'node',
    '--bundle-node-modules',
    '--log-level', '2',
    '--no-minify',
    '--no-source-maps',
    '--cache-dir', 'cache-dir'
  ]));
});

test('throws in case of error', () => {
  const builder = new Builder({
    entry: 'error',
    global: 'handler',
    outDir: 'out-dir'
  });
  expect(() => builder.build()).toThrow('parcel-error');
});

test('throws if status is not 0', () => {
  const builder = new Builder({
    entry: 'status',
    global: 'handler',
    outDir: 'out-dir'
  });
  expect(() => builder.build()).toThrow('status-error');
});

test('throws when parcel-bundler is not 1.x', () => {
  fs.writeFileSync(parcelPkgPath, JSON.stringify({
    ...JSON.parse(parcelPkg.toString()),
    version: '2.3.4'
  }));
  expect(() => new Builder({
    entry: 'entry',
    global: 'handler',
    outDir: 'out-dur'
  })).toThrow(/This module has a peer dependency on parcel-bundler v1.x. Got v2.3.4./);
});
