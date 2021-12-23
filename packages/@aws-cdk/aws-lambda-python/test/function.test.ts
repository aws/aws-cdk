import { Template } from '@aws-cdk/assertions';
import { Code, Runtime } from '@aws-cdk/aws-lambda';
import { AssetHashType, AssetOptions, Stack } from '@aws-cdk/core';
import { PythonFunction } from '../lib';
import { bundle } from '../lib/bundling';

jest.mock('../lib/bundling', () => {
  return {
    bundle: jest.fn().mockImplementation((options: AssetOptions): Code => {
      const mockObjectKey = (() => {
        const hashType = options.assetHashType ?? (options.assetHash ? 'custom' : 'source');
        switch (hashType) {
          case 'source': return 'SOURCE_MOCK';
          case 'output': return 'OUTPUT_MOCK';
          case 'custom': {
            if (!options.assetHash) { throw new Error('no custom hash'); }
            return options.assetHash;
          }
        }

        throw new Error('unexpected asset hash type');
      })();

      return {
        isInline: false,
        bind: () => ({
          s3Location: {
            bucketName: 'mock-bucket-name',
            objectKey: mockObjectKey,
          },
        }),
        bindToResource: () => { return; },
      };
    }),
    hasDependencies: jest.fn().mockReturnValue(false),
  };
});

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
  jest.clearAllMocks();
});

test('PythonFunction with defaults', () => {
  new PythonFunction(stack, 'handler', {
    entry: 'test/lambda-handler',
    runtime: Runtime.PYTHON_3_8,
  });

  expect(bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringMatching(/aws-lambda-python\/test\/lambda-handler$/),
    outputPathSuffix: '.',
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'index.handler',
  });
});

test('PythonFunction with index in a subdirectory', () => {
  new PythonFunction(stack, 'handler', {
    entry: 'test/lambda-handler-sub',
    index: 'inner/custom_index.py',
    handler: 'custom_handler',
    runtime: Runtime.PYTHON_3_8,
  });

  expect(bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringMatching(/aws-lambda-python\/test\/lambda-handler-sub$/),
    outputPathSuffix: '.',
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'inner/custom_index.custom_handler',
  });
});

test('throws when index is not py', () => {
  expect(() => new PythonFunction(stack, 'Fn', {
    entry: 'test/lambda-handler',
    index: 'index.js',
    runtime: Runtime.PYTHON_3_8,
  })).toThrow(/Only Python \(\.py\) index files are supported/);
});

test('throws when entry does not exist', () => {
  expect(() => new PythonFunction(stack, 'Fn', {
    entry: 'notfound',
    runtime: Runtime.PYTHON_3_8,
  })).toThrow(/Cannot find index file at/);
});

test('throws with the wrong runtime family', () => {
  expect(() => new PythonFunction(stack, 'handler1', {
    entry: 'test/lambda-handler',
    runtime: Runtime.NODEJS_12_X,
  })).toThrow(/Only `PYTHON` runtimes are supported/);
});

test('allows specifying hash type', () => {
  new PythonFunction(stack, 'source1', {
    entry: 'test/lambda-handler-nodeps',
    index: 'index.py',
    handler: 'handler',
    runtime: Runtime.PYTHON_3_8,
  });

  new PythonFunction(stack, 'source2', {
    entry: 'test/lambda-handler-nodeps',
    index: 'index.py',
    handler: 'handler',
    assetHashType: AssetHashType.SOURCE,
    runtime: Runtime.PYTHON_3_8,
  });

  new PythonFunction(stack, 'output', {
    entry: 'test/lambda-handler-nodeps',
    index: 'index.py',
    handler: 'handler',
    assetHashType: AssetHashType.OUTPUT,
    runtime: Runtime.PYTHON_3_8,
  });

  new PythonFunction(stack, 'custom', {
    entry: 'test/lambda-handler-nodeps',
    index: 'index.py',
    handler: 'handler',
    assetHash: 'MY_CUSTOM_HASH',
    runtime: Runtime.PYTHON_3_8,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Code: {
      S3Bucket: 'mock-bucket-name',
      S3Key: 'SOURCE_MOCK',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Code: {
      S3Bucket: 'mock-bucket-name',
      S3Key: 'OUTPUT_MOCK',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Code: {
      S3Bucket: 'mock-bucket-name',
      S3Key: 'MY_CUSTOM_HASH',
    },
  });
});
