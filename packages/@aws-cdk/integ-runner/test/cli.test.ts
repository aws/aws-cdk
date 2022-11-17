import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { main, parseCliArgs } from '../lib/cli';

let stdoutMock: jest.SpyInstance;
beforeEach(() => {
  stdoutMock = jest.spyOn(process.stdout, 'write').mockImplementation(() => { return true; });
});
afterEach(() => {
  stdoutMock.mockRestore();
});

describe('CLI', () => {
  const currentCwd = process.cwd();
  beforeAll(() => {
    process.chdir(path.join(__dirname, '..'));
  });
  afterAll(() => {
    process.chdir(currentCwd);
  });

  test('find by default pattern', async () => {
    await main(['--list', '--directory=test/test-data']);

    // Expect nothing to be found since this directory doesn't contain files with the default pattern
    expect(stdoutMock.mock.calls).toEqual([['\n']]);
  });

  test('find by custom pattern', async () => {
    await main(['--list', '--directory=test/test-data', '--test-regex="^xxxxx\.integ-test[12]\.js$"']);

    expect(stdoutMock.mock.calls).toEqual([[
      [
        'xxxxx.integ-test1.js',
        'xxxxx.integ-test2.js',
        '',
      ].join('\n'),
    ]]);
  });

  test('list only shows explicitly provided tests', async () => {
    await main(['xxxxx.integ-test1.js', 'xxxxx.integ-test2.js', '--list', '--directory=test/test-data', '--test-regex="^xxxxx\..*\.js$"']);

    expect(stdoutMock.mock.calls).toEqual([[
      [
        'xxxxx.integ-test1.js',
        'xxxxx.integ-test2.js',
        '',
      ].join('\n'),
    ]]);
  });

  test('can run with no tests detected', async () => {
    await main(['whatever.js', '--directory=test/test-data']);

    expect(stdoutMock.mock.calls).toEqual([]);
  });
});

describe('CLI config file', () => {
  const configFile = 'integ.config.json';
  const withConfig = (settings: any, fileName = configFile) => {
    fs.writeFileSync(fileName, JSON.stringify(settings, null, 2), { encoding: 'utf-8' });
  };

  const currentCwd = process.cwd();
  beforeEach(() => {
    process.chdir(os.tmpdir());
  });
  afterEach(() => {
    process.chdir(currentCwd);
  });

  test('options are read from config file', async () => {
    // WHEN
    withConfig({
      list: true,
      maxWorkers: 3,
      parallelRegions: [
        'eu-west-1',
        'ap-southeast-2',
      ],
    });
    const options = parseCliArgs();

    // THEN
    expect(options.list).toBe(true);
    expect(options.maxWorkers).toBe(3);
    expect(options.testRegions).toEqual([
      'eu-west-1',
      'ap-southeast-2',
    ]);
  });

  test('cli options take precedent', async () => {
    // WHEN
    withConfig({ maxWorkers: 3 });
    const options = parseCliArgs(['--max-workers', '20']);

    // THEN
    expect(options.maxWorkers).toBe(20);
  });
});
