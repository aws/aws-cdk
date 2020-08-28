import '@aws-cdk/assert/jest';
import * as path from 'path';
import { Stack } from '@aws-cdk/core';
import { hasDependencies, bundleLayer } from '../lib/bundling';
import { PythonLayerVersion } from '../lib/layer';

jest.mock('../lib/bundling', () => {
  return {
    bundleLayer: jest.fn().mockReturnValue({
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
  });

  expect(bundleLayer).toHaveBeenCalledWith(expect.objectContaining({
    entry,
  }));
});
