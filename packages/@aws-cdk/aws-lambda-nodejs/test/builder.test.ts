import { spawnSync } from 'child_process';
import * as path from 'path';
import { Builder } from '../lib/builder';

jest.mock('child_process', () => ({
  spawnSync: jest.fn((_cmd: string, args: string[]) => {
    if (args.includes('/entry/error')) {
      return { error: 'parcel-error' };
    }

    if (args.includes('/entry/status')) {
      return { status: 1, stdout: Buffer.from('status-error') };
    }

    return { error: null, status: 0 };
  })
}));

test('calls docker with the correct args', () => {
  const builder = new Builder({
    entry: 'entry',
    global: 'handler',
    outDir: 'out-dir',
    cacheDir: 'cache-dir',
  });
  builder.build();

  // docker build
  expect(spawnSync).toHaveBeenNthCalledWith(1, 'docker', [
    'build', '-t', 'parcel-bundler', path.join(__dirname, '../parcel-bundler')
  ]);

  // docker run
  expect(spawnSync).toHaveBeenNthCalledWith(2, 'docker', [
    'run', '--rm',
    '-v', `${path.join(__dirname, '..')}:/entry`,
    '-v', `${path.join(__dirname, '../out-dir')}:/out`,
    '-v', `${path.join(__dirname, '../cache-dir')}:/cache`,
    'parcel-bundler',
    'parcel', 'build', '/entry/entry',
    '--out-dir', '/out',
    '--out-file', 'index.js',
    '--global', 'handler',
    '--target', 'node',
    '--bundle-node-modules',
    '--log-level', '2',
    '--no-minify',
    '--no-source-maps',
    '--cache-dir', '/cache'
  ]);
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
