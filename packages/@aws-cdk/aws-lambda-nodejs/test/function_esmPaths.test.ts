import { Template } from '@aws-cdk/assertions';
import { CodeConfig } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { NodejsFunction } from '../lib';
import { Bundling } from '../lib/bundling';
import { CallSite } from '../lib/util';
import * as util from '../lib/util';

jest.mock('../lib/bundling', () => {
  return {
    Bundling: {
      bundle: jest.fn().mockReturnValue({
        bind: (): CodeConfig => {
          return {
            s3Location: {
              bucketName: 'my-bucket',
              objectKey: 'my-key',
            },
          };
        },
        bindToResource: () => { return; },
      }),
    },
  };
});

const actualFindDefiningFile = util.findDefiningFile;

jest.spyOn(util, 'findDefiningFile').mockImplementation((sites: CallSite[]): string => {
  return 'file://' + actualFindDefiningFile(sites);
});

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
  jest.clearAllMocks();
});

test('NodejsFunction with .ts handler, with ESM file:// paths', () => {
  // WHEN
  new NodejsFunction(stack, 'handler1');

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringContaining('function_esmPaths.test.handler1.ts'), // Automatically finds .ts handler file
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'index.handler',
    Runtime: 'nodejs14.x',
  });
});
