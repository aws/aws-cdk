import * as path from 'path';
import { main } from '../lib/cli';

describe('CLI', () => {
  const currentCwd = process.cwd();
  beforeAll(() => {
    process.chdir(path.join(__dirname, '..'));
  });
  afterAll(() => {
    process.chdir(currentCwd);
  });

  let stdoutMock: jest.SpyInstance;
  beforeEach(() => {
    stdoutMock = jest.spyOn(process.stdout, 'write').mockImplementation(() => { return true; });
  });
  afterEach(() => {
    stdoutMock.mockRestore();
  });

  test('find by default pattern', async () => {
    await main(['--list', '--directory=test/test-data']);

    // Expect nothing to be found since this directory doesn't contain files with the default pattern
    expect(stdoutMock.mock.calls).toEqual([['\n']]);
  });

  test('find by custom pattern', async () => {
    await main(['--list', '--directory=test/test-data', '--test-regex="^xxxxx\..*\.js$"']);

    expect(stdoutMock.mock.calls).toEqual([[
      [
        'xxxxx.integ-test1.js',
        'xxxxx.integ-test2.js',
        'xxxxx.test-with-new-assets-diff.js',
        'xxxxx.test-with-new-assets.js',
        'xxxxx.test-with-snapshot-assets-diff.js',
        'xxxxx.test-with-snapshot-assets.js',
        'xxxxx.test-with-snapshot.js',
        '',
      ].join('\n'),
    ]]);
  });

  test('find only TypeScript files', async () => {
    await main(['--list', '--language', 'typescript', '--directory=test/test-data-typescript', '--test-regex="^xxxxx\\..*(?<!\\.d)\\.ts$"']);

    expect(stdoutMock.mock.calls).toEqual([[
      [
        'xxxxx.typescript-test.ts',
        '',
      ].join('\n'),
    ]]);
  });
});
