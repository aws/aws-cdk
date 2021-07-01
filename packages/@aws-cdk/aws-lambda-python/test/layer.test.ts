import '@aws-cdk/assert-internal/jest';
import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { stageDependencies, bundle } from '../lib/bundling';
import { PythonLayerVersion } from '../lib/layer';

jest.mock('../lib/bundling', () => {
  return {
    bundle: jest.fn().mockReturnValue({
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
    stageDependencies: jest.fn().mockReturnValue(true),
  };
});

const hasDependenciesMock = (stageDependencies as jest.Mock);

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
  });

  expect(bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry,
    outputPathSuffix: 'python',
  }));
});

test('Fails when bundling a layer for a runtime not supported', () => {
  expect(() => {
    new PythonLayerVersion(stack, 'layer', {
      entry: '/some/path',
      compatibleRuntimes: [Runtime.PYTHON_2_7, Runtime.NODEJS],
    });
  }).toThrow(/PYTHON.*support/);
});
