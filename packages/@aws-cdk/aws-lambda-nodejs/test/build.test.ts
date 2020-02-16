import { spawnSync } from 'child_process';
import { build } from '../lib/build';

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
  build({
    entry: 'entry',
    global: 'handler',
    outDir: 'out-dir',
    cacheDir: 'cache-dir',
  });

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
  expect(() => build({
    entry: 'error',
    global: 'handler',
    outDir: 'out-dir'
  })).toThrow('parcel-error');
});

test('throws if status is not 0', () => {
  expect(() => build({
    entry: 'status',
    global: 'handler',
    outDir: 'out-dir'
  })).toThrow('status-error');
});
