import '@aws-cdk/assert/jest';
import * as path from 'path';
import { Stack } from '@aws-cdk/core';
import { bundleDependenciesLayer, bundleFilesLayer, hasDependencies } from '../lib/bundling';
import { PythonLayerVersion, BundlingStrategy } from '../lib/layer';

jest.mock('../lib/bundling', () => {
  return {
    bundleDependenciesLayer: jest.fn().mockReturnValue({
      bind: () => {
        return {
          s3Location: {
            bucketName: 'bucket',
            objectKey: 'key',
          },
        };
      },
      bindToResource: () => { return; },
    }),
    bundleFilesLayer: jest.fn().mockReturnValue({
      bind: () => {
        return {
          s3Location: {
            bucketName: 'bucket',
            objectKey: 'key',
          },
        };
      },
      bindToResource: () => { return; },
    }),
    hasDependencies: jest.fn().mockReturnValue(true),
  };
});

const hasDependenciesMock = (hasDependencies as jest.Mock);

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
  jest.clearAllMocks();
});

test('Bundling a layer from files', () => {
  hasDependenciesMock.mockReturnValue(false);

  const entry = path.join(__dirname, 'test/lambda-handler-project');
  new PythonLayerVersion(stack, 'layer', {
    entry,
    bundlingStrategy: BundlingStrategy.FILES,
    exclude: [
      '*',
      '!shared',
      '!shared/**',
    ],
  });

  expect(bundleFilesLayer).toHaveBeenCalledWith(expect.objectContaining({
    entry,
  }));
});

test('Bundling a layer by installing dependencies', () => {
  hasDependenciesMock.mockReturnValue(true);

  const entry = path.join(__dirname, 'test/lambda-handler-project');
  new PythonLayerVersion(stack, 'layer', {
    entry,
    bundlingStrategy: BundlingStrategy.DEPENDENCIES,
  });

  expect(bundleDependenciesLayer).toHaveBeenCalledWith(expect.objectContaining({
    entry,
  }));
});

test('Bundling a layer by installing dependencies throws when there are no dependencies', () => {
  hasDependenciesMock.mockReturnValue(false);

  const entry = path.join(__dirname, 'test/lambda-handler-project');

  expect(() => {
    new PythonLayerVersion(stack, 'layer', {
      entry,
      bundlingStrategy: BundlingStrategy.DEPENDENCIES,
    });
  }).toThrow(/No dependencies/i);
});

test('Bundling strategy defaults to DEPENDENCIES when there are dependencies', () => {
  hasDependenciesMock.mockReturnValue(true);

  const entry = path.join(__dirname, 'test/lambda-handler-project');
  new PythonLayerVersion(stack, 'layer', {
    entry,
  });

  expect(bundleDependenciesLayer).toHaveBeenCalled();
});

test('Bundling strategy defaults to FILES when there are not dependencies', () => {
  hasDependenciesMock.mockReturnValue(false);

  const entry = path.join(__dirname, 'test/lambda-handler-project');
  new PythonLayerVersion(stack, 'layer', {
    entry,
  });

  expect(bundleFilesLayer).toHaveBeenCalled();
});
