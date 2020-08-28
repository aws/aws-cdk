import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Code, Runtime } from '@aws-cdk/aws-lambda';
import { bundleFunction, bundleFilesLayer, LocalPythonLayersBundler, hasDependencies, bundleDependenciesLayer } from '../lib/bundling';

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
  bundleFunction({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
  });

  // Correctly bundles
  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -r . /asset-output',
      ],
    }),
  }));

  // Searches for requirements.txt in entry
  expect(existsSyncMock).toHaveBeenCalledWith(path.join(entry, 'requirements.txt'));
});

test('Bundling a function with requirements.txt installed', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  bundleFunction({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
  });

  // Correctly bundles
  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -r /var/dependencies/. /asset-output && rsync -r . /asset-output',
      ],
    }),
  }));

  // Searches for requirements.txt in entry
  expect(existsSyncMock).toHaveBeenCalledWith(path.join(entry, 'requirements.txt'));
});

test('Bundling Python 2.7 with requirements.txt installed', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  bundleFunction({
    entry: entry,
    runtime: Runtime.PYTHON_2_7,
  });

  // Correctly bundles with requirements.txt pip installed
  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -r /var/dependencies/. /asset-output && rsync -r . /asset-output',
      ],
    }),
  }));

  // Searches for requirements.txt in entry
  expect(existsSyncMock).toHaveBeenCalledWith(path.join(entry, 'requirements.txt'));
});

test('Bundling a layer with dependencies', () => {
  const entry = path.join(__dirname, 'lambda-handler');

  bundleDependenciesLayer({
    entry: entry,
    runtime: Runtime.PYTHON_2_7,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -r /var/dependencies /asset-output/python',
      ],
    }),
  }));
});

test('Bundling a python code layer', () => {
  bundleFilesLayer({
    entry: '/project/folder',
    exclude: [
      '*',
      '!shared',
      '!shared/**',
    ],
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project/folder', expect.objectContaining({
    bundling: expect.objectContaining({
      // Docker should report it is being run erroneously
      command: expect.arrayContaining([expect.stringContaining('exit 1')]),
      // Local bundling
      local: {
        options: expect.objectContaining({
          entry: '/project/folder',
          exclude: expect.arrayContaining([
            '*',
            '!shared',
          ]),
        }),
      },
    }),
  }));
});

describe('Local bundler for python code layers', () => {
  test('asset without excludes', () => {
    const entryPath = path.join(__dirname, 'lambda-handler-project');
    const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-test'));

    // WHEN
    const bundler = new LocalPythonLayersBundler({
      entry: entryPath,
    });
    const tryBundleResult = bundler.tryBundle(outputDir);

    // THEN
    expect(tryBundleResult).toBe(true);
    expect(fs.readdirSync(path.join(outputDir, 'python'))).toEqual([
      'lambda',
      'requirements.txt',
      'shared',
    ]);
  });

  test('asset with excludes', () => {
    const entryPath = path.join(__dirname, 'lambda-handler-project');
    const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-test'));

    // WHEN
    const bundler = new LocalPythonLayersBundler({
      entry: entryPath,
      exclude: [
        '*',
        '!shared',
        '!shared/**',
      ],
    });
    const tryBundleResult = bundler.tryBundle(outputDir);

    // THEN
    expect(tryBundleResult).toBe(true);
    expect(fs.readdirSync(path.join(outputDir, 'python'))).toEqual([
      'shared',
    ]);
  });
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
