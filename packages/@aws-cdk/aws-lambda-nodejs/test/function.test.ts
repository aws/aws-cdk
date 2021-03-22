import '@aws-cdk/assert/jest';
import * as fs from 'fs';
import * as path from 'path';
import { ABSENT } from '@aws-cdk/assert';
import { Vpc } from '@aws-cdk/aws-ec2';
import { Runtime } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { NodejsFunction } from '../lib';
import { Bundling } from '../lib/bundling';
import { nodeMajorVersion } from '../lib/util';

jest.mock('../lib/bundling', () => {
  return {
    Bundling: {
      bundle: jest.fn().mockReturnValue({
        bind: () => {
          return { inlineCode: 'code' };
        },
        bindToResource: () => { return; },
      }),
    },
  };
});

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
  jest.clearAllMocks();
});

test('NodejsFunction with .ts handler', () => {
  // WHEN
  new NodejsFunction(stack, 'handler1');

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringContaining('function.test.handler1.ts'), // Automatically finds .ts handler file
  }));

  const runtime = nodeMajorVersion() >= 14
    ? Runtime.NODEJS_14_X
    : Runtime.NODEJS_12_X;

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'index.handler',
    Runtime: runtime.name,
  });
});

test('NodejsFunction with .js handler', () => {
  // WHEN
  new NodejsFunction(stack, 'handler2');

  // THEN
  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringContaining('function.test.handler2.js'), // Automatically finds .ts handler file
  }));
});

test('NodejsFunction with container env vars', () => {
  // WHEN
  new NodejsFunction(stack, 'handler1', {
    bundling: {
      environment: {
        KEY: 'VALUE',
      },
    },
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    environment: {
      KEY: 'VALUE',
    },
  }));
});

test('throws when entry is not js/ts', () => {
  expect(() => new NodejsFunction(stack, 'Fn', {
    entry: 'handler.py',
  })).toThrow(/Only JavaScript or TypeScript entry files are supported/);
});

test('accepts tsx', () => {
  const entry = path.join(__dirname, 'handler.tsx');

  fs.symlinkSync(path.join(__dirname, 'function.test.handler1.ts'), entry);

  expect(() => new NodejsFunction(stack, 'Fn', {
    entry,
  })).not.toThrow();

  fs.unlinkSync(entry);
});

test('throws when entry does not exist', () => {
  expect(() => new NodejsFunction(stack, 'Fn', {
    entry: 'notfound.ts',
  })).toThrow(/Cannot find entry file at/);
});

test('throws when entry cannot be automatically found', () => {
  expect(() => new NodejsFunction(stack, 'Fn')).toThrow(/Cannot find entry file./);
});

test('throws with the wrong runtime family', () => {
  expect(() => new NodejsFunction(stack, 'handler1', {
    runtime: Runtime.PYTHON_3_8,
  })).toThrow(/Only `NODEJS` runtimes are supported/);
});

test('throws with non existing lock file', () => {
  expect(() => new NodejsFunction(stack, 'handler1', {
    depsLockFilePath: '/does/not/exist.lock',
  })).toThrow(/Lock file at \/does\/not\/exist.lock doesn't exist/);
});

test('throws when depsLockFilePath is not a file', () => {
  expect(() => new NodejsFunction(stack, 'handler1', {
    depsLockFilePath: __dirname,
  })).toThrow(/\`depsLockFilePath\` should point to a file/);
});

test('resolves depsLockFilePath to an absolute path', () => {
  new NodejsFunction(stack, 'handler1', {
    depsLockFilePath: './package.json',
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    depsLockFilePath: expect.stringMatching(/@aws-cdk\/aws-lambda-nodejs\/package.json$/),
  }));
});

test('resolves entry to an absolute path', () => {
  // WHEN
  new NodejsFunction(stack, 'fn', {
    entry: 'lib/index.ts',
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(expect.objectContaining({
    entry: expect.stringMatching(/@aws-cdk\/aws-lambda-nodejs\/lib\/index.ts$/),
  }));
});

test('configures connection reuse for aws sdk', () => {
  // WHEN
  new NodejsFunction(stack, 'handler1');

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      },
    },
  });
});

test('can opt-out of connection reuse for aws sdk', () => {
  // WHEN
  new NodejsFunction(stack, 'handler1', {
    awsSdkConnectionReuse: false,
  });

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Environment: ABSENT,
  });
});

test('NodejsFunction in a VPC', () => {
  // GIVEN
  const vpc = new Vpc(stack, 'Vpc');

  // WHEN
  new NodejsFunction(stack, 'handler1', { vpc });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    VpcConfig: {
      SecurityGroupIds: [
        {
          'Fn::GetAtt': [
            'handler1SecurityGroup30688A62',
            'GroupId',
          ],
        },
      ],
      SubnetIds: [
        {
          Ref: 'VpcPrivateSubnet1Subnet536B997A',
        },
        {
          Ref: 'VpcPrivateSubnet2Subnet3788AAA1',
        },
      ],
    },
  });
});
