import * as fs from 'fs';
import * as path from 'path';
import { Code, Runtime } from '@aws-cdk/aws-lambda';
import { hasDependencies, bundle } from '../lib/bundling';

jest.mock('@aws-cdk/aws-lambda');
const existsSyncOriginal = fs.existsSync;
const existsSyncMock = jest.spyOn(fs, 'existsSync');

jest.mock('child_process', () => ({
  spawnSync: jest.fn(() => {
    return {
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('sha256:1234567890abcdef'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    };
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('Bundling a function without dependencies', () => {
  const entry = path.join(__dirname, 'lambda-handler-nodeps');
  bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    outputPathSuffix: '.',
  });

  // Correctly bundles
  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -r . /asset-output/.',
      ],
    }),
  }));

  // Searches for requirements.txt in entry
  expect(existsSyncMock).toHaveBeenCalledWith(path.join(entry, 'requirements.txt'));
});

test('Bundling a function with requirements.txt installed', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    outputPathSuffix: '.',
  });

  // Correctly bundles
  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -r /var/dependencies/. /asset-output/. && rsync -r . /asset-output/.',
      ],
    }),
  }));

  // Searches for requirements.txt in entry
  expect(existsSyncMock).toHaveBeenCalledWith(path.join(entry, 'requirements.txt'));
});

test('Bundling Python 2.7 with requirements.txt installed', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  bundle({
    entry: entry,
    runtime: Runtime.PYTHON_2_7,
    outputPathSuffix: '.',
  });

  // Correctly bundles with requirements.txt pip installed
  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -r /var/dependencies/. /asset-output/. && rsync -r . /asset-output/.',
      ],
    }),
  }));

  // Searches for requirements.txt in entry
  expect(existsSyncMock).toHaveBeenCalledWith(path.join(entry, 'requirements.txt'));
});

test('Bundling a layer with dependencies', () => {
  const entry = path.join(__dirname, 'lambda-handler');

  bundle({
    entry: entry,
    runtime: Runtime.PYTHON_2_7,
    outputPathSuffix: 'python',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -r /var/dependencies/. /asset-output/python && rsync -r . /asset-output/python',
      ],
    }),
  }));
});

test('Bundling a python code layer', () => {
  const entry = path.join(__dirname, 'lambda-handler-nodeps');

  bundle({
    entry: path.join(entry, '.'),
    runtime: Runtime.PYTHON_2_7,
    outputPathSuffix: 'python',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -r . /asset-output/python',
      ],
    }),
  }));
});

describe('Dependency detection', () => {
  test('Detects pipenv', () => {
    existsSyncMock.mockImplementation((p: fs.PathLike) => {
      if (/Pipfile/.test(p.toString())) {
        return true;
      }
      return existsSyncOriginal(p);
    });

    expect(hasDependencies('/asset-input')).toEqual(true);
  });

  test('Detects poetry', () => {
    existsSyncMock.mockImplementation((p: fs.PathLike) => {
      if (/poetry.lock/.test(p.toString())) {
        return true;
      }
      return existsSyncOriginal(p);
    });

    expect(hasDependencies('/asset-input')).toEqual(true);
  });

  test('Detects requirements.txt', () => {
    existsSyncMock.mockImplementation((p: fs.PathLike) => {
      if (/requirements.txt/.test(p.toString())) {
        return true;
      }
      return existsSyncOriginal(p);
    });

    expect(hasDependencies('/asset-input')).toEqual(true);
  });

  test('No known dependencies', () => {
    existsSyncMock.mockImplementation(() => false);
    expect(hasDependencies('/asset-input')).toEqual(false);
  });
});
