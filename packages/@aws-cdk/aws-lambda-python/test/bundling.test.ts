import * as fs from 'fs';
import * as path from 'path';
import { Architecture, Code, Runtime } from '@aws-cdk/aws-lambda';
import { DockerImage, FileSystem } from '@aws-cdk/core';
import { stageDependencies, Bundling } from '../lib/bundling';

jest.spyOn(Code, 'fromAsset');
jest.spyOn(DockerImage, 'fromBuild');

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
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    architecture: Architecture.X86_64,
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

  expect(DockerImage.fromBuild).toHaveBeenCalledWith(expect.stringMatching(/python-bundling/), expect.objectContaining({
    buildArgs: expect.objectContaining({
      IMAGE: expect.stringMatching(/build-python/),
    }),
    platform: 'linux/amd64',
  }));
});

test('Bundling a function with requirements.txt installed', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    architecture: Architecture.X86_64,
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
});

test('Bundling Python 2.7 with requirements.txt installed', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_2_7,
    architecture: Architecture.X86_64,
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
});

test('Bundling a layer with dependencies', () => {
  const entry = path.join(__dirname, 'lambda-handler');

  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_9,
    architecture: Architecture.X86_64,
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

  Bundling.bundle({
    entry: path.join(entry, '.'),
    runtime: Runtime.PYTHON_3_9,
    architecture: Architecture.X86_64,
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
  test.each(['Pipfile', 'poetry.lock', 'requirements.txt'])('detect dependency %p', filename => {
    // GIVEN
    const sourcedir = FileSystem.mkdtemp('source-');
    const stagedir = FileSystem.mkdtemp('stage-');
    fs.writeFileSync(path.join(sourcedir, filename), 'dummy!');

    // WHEN
    const found = stageDependencies(sourcedir, stagedir);

    // THEN
    expect(found).toBeTruthy();
    expect(fs.existsSync(path.join(stagedir, filename))).toBeTruthy();
  });

  test('No known dependencies', () => {
    const sourcedir = FileSystem.mkdtemp('source-');
    expect(stageDependencies(sourcedir, '/dummy')).toEqual(false);
  });
});
