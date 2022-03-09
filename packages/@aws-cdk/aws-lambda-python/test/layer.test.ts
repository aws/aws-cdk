import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { DockerImage, Stack } from '@aws-cdk/core';
import { Bundling } from '../lib/bundling';
import { PythonLayerVersion } from '../lib/layer';

jest.mock('../lib/bundling', () => {
  return {
    Bundling: {
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
    },
    stageDependencies: jest.fn().mockReturnValue(true),
  };
});

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
  jest.clearAllMocks();
});

test('Bundling a layer from files', () => {
  const entry = path.join(__dirname, 'test/lambda-handler-project');
  new PythonLayerVersion(stack, 'layer', {
    entry,
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
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

test('Allows use of custom bundling image', () => {
  const entry = path.join(__dirname, 'lambda-handler-custom-build');
  const image = DockerImage.fromBuild(path.join(entry));

  new PythonLayerVersion(stack, 'layer', {
    entry,
    bundling: { image },
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    image,
  }));
});

test('Skip bundling when stack does not require it', () => {
  const spy = jest.spyOn(stack, 'bundlingRequired', 'get').mockReturnValue(false);
  const entry = path.join(__dirname, 'lambda-handler-project');

  new PythonLayerVersion(stack, 'layer', {
    entry,
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    skip: true,
  }));

  spy.mockRestore();
});

test('Do not skip bundling when stack requires it', () => {
  const spy = jest.spyOn(stack, 'bundlingRequired', 'get').mockReturnValue(true);
  const entry = path.join(__dirname, 'lambda-handler-project');

  new PythonLayerVersion(stack, 'layer', {
    entry,
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    skip: false,
  }));

  spy.mockRestore();
});
