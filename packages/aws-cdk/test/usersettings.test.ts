import * as os from 'os';
import * as fs_path from 'path';
import * as fs from 'fs-extra';
import { mocked } from 'ts-jest/utils';
import { Configuration, PROJECT_CONFIG, PROJECT_CONTEXT } from '../lib/settings';

// mock fs deeply
jest.mock('fs-extra');
const mockedFs = mocked(fs, true);

const USER_CONFIG = fs_path.join(os.homedir(), '.cdk.json');

test('load settings from both files if available', async () => {
  // GIVEN
  const GIVEN_CONFIG: Map<string, any> = new Map([
    [PROJECT_CONFIG, {
      project: 'foobar',
    }],
    [USER_CONFIG, {
      project: 'foo',
      test: 'bar',
    }],
  ]);

  // WHEN
  mockedFs.pathExists.mockImplementation(path => {
    return GIVEN_CONFIG.has(path);
  });
  mockedFs.readJSON.mockImplementation(path => {
    return GIVEN_CONFIG.get(path);
  });

  const config = await new Configuration().load();

  // THEN
  expect(config.settings.get(['project'])).toBe('foobar');
  expect(config.settings.get(['test'])).toBe('bar');
});

test('load context from all 3 files if available', async () => {
  // GIVEN
  const GIVEN_CONFIG: Map<string, any> = new Map([
    [PROJECT_CONFIG, {
      context: {
        project: 'foobar',
      },
    }],
    [PROJECT_CONTEXT, {
      foo: 'bar',
    }],
    [USER_CONFIG, {
      context: {
        test: 'bar',
      },
    }],
  ]);

  // WHEN
  mockedFs.pathExists.mockImplementation(path => {
    return GIVEN_CONFIG.has(path);
  });
  mockedFs.readJSON.mockImplementation(path => {
    return GIVEN_CONFIG.get(path);
  });

  const config = await new Configuration().load();

  // THEN
  expect(config.context.get('project')).toBe('foobar');
  expect(config.context.get('foo')).toBe('bar');
  expect(config.context.get('test')).toBe('bar');
});

test('throws an error if the `build` key is specified in the user config', async () => {
  // GIVEN
  const GIVEN_CONFIG: Map<string, any> = new Map([
    [USER_CONFIG, {
      build: 'foobar',
    }],
  ]);

  // WHEN
  mockedFs.pathExists.mockImplementation(path => {
    return GIVEN_CONFIG.has(path);
  });
  mockedFs.readJSON.mockImplementation(path => {
    return GIVEN_CONFIG.get(path);
  });

  // THEN
  await expect(new Configuration().load()).rejects.toEqual(new Error('The `build` key cannot be specified in the user config (~/.cdk.json), specify it in the project config (cdk.json) instead'));
});