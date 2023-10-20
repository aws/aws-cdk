import { bockfs } from '@aws-cdk/cdk-build-tools';
import { Template, Match } from '../../assertions';
import { Vpc } from '../../aws-ec2';
import { CodeConfig, Runtime } from '../../aws-lambda';
import { App, Stack } from '../../core';
import { LAMBDA_NODEJS_USE_LATEST_RUNTIME } from '../../cx-api';
import { NodejsFunction } from '../lib';
import { Bundling } from '../lib/bundling';

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

const mockCallsites = jest.fn();
jest.mock('../lib/util', () => ({
  ...jest.requireActual('../lib/util'),
  callsites: () => mockCallsites(),
}));

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
  jest.clearAllMocks();
});

// We MUST use a fake file system here.
// Using the real filesystem causes the tests to be flaky and fail at random.
// This way we are guaranteed to have the fake files setup on each test run.
bockfs({
  '/home/project/package.json': '{}',
  '/home/project/package-lock.json': '{}',
  '/home/project/handler.tsx': '// nothing',
  '/home/project/function.test.handler1.ts': '// nothing',
  '/home/project/function.test.handler2.js': '// nothing',
  '/home/project/function.test.handler3.mjs': '// nothing',
  '/home/project/function.test.handler4.mts': '// nothing',
  '/home/project/function.test.handler5.cts': '// nothing',
  '/home/project/function.test.handler6.cjs': '// nothing',
  '/home/project/aws-lambda-nodejs/lib/index.ts': '// nothing',
});
const bockPath = bockfs.workingDirectory('/home/project');

// pretend the calling file is in a fake file path
mockCallsites.mockImplementation(() => [
  { getFunctionName: () => 'NodejsFunction' },
  { getFileName: () => bockPath`function.test.ts` },
]);

afterAll(() => {
  bockfs.restore();
});

test('NodejsFunction with .ts handler', () => {
  // WHEN
  new NodejsFunction(stack, 'handler1');

  expect(Bundling.bundle).toHaveBeenCalledWith(stack, expect.objectContaining({
    entry: expect.stringContaining('function.test.handler1.ts'), // Automatically finds .ts handler file
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'index.handler',
    Runtime: Match.stringLikeRegexp('nodejs'),
  });
});

test('NodejsFunction with overridden handler - no dots', () => {
  // WHEN
  new NodejsFunction(stack, 'handler1', {
    handler: 'myHandler',
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(stack, expect.objectContaining({
    entry: expect.stringContaining('function.test.handler1.ts'), // Automatically finds .ts handler file
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'index.myHandler', // automatic index. prefix
    Runtime: Match.stringLikeRegexp('nodejs'),
  });
});

test('NodejsFunction with overridden handler - with dots', () => {
  // WHEN
  new NodejsFunction(stack, 'handler1', {
    handler: 'run.sh',
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(stack, expect.objectContaining({
    entry: expect.stringContaining('function.test.handler1.ts'), // Automatically finds .ts handler file
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'run.sh', // No index. prefix
    Runtime: Match.stringLikeRegexp('nodejs'),
  });
});

test('NodejsFunction with .js handler', () => {
  // WHEN
  new NodejsFunction(stack, 'handler2');

  // THEN
  expect(Bundling.bundle).toHaveBeenCalledWith(stack, expect.objectContaining({
    entry: expect.stringContaining('function.test.handler2.js'), // Automatically finds .ts handler file
  }));
});

test('NodejsFunction with .mjs handler', () => {
  // WHEN
  new NodejsFunction(stack, 'handler3');

  // THEN
  expect(Bundling.bundle).toHaveBeenCalledWith(stack, expect.objectContaining({
    entry: expect.stringContaining('function.test.handler3.mjs'), // Automatically finds .mjs handler file
  }));
});

test('NodejsFunction with .mts handler', () => {
  // WHEN
  new NodejsFunction(stack, 'handler4');

  // THEN
  expect(Bundling.bundle).toHaveBeenCalledWith(stack, expect.objectContaining({
    entry: expect.stringContaining('function.test.handler4.mts'), // Automatically finds .mts handler file
  }));
});

test('NodejsFunction with .cts handler', () => {
  // WHEN
  new NodejsFunction(stack, 'handler5');

  // THEN
  expect(Bundling.bundle).toHaveBeenCalledWith(stack, expect.objectContaining({
    entry: expect.stringContaining('function.test.handler5.cts'), // Automatically finds .cts handler file
  }));
});

test('NodejsFunction with .cjs handler', () => {
  // WHEN
  new NodejsFunction(stack, 'handler6');

  // THEN
  expect(Bundling.bundle).toHaveBeenCalledWith(stack, expect.objectContaining({
    entry: expect.stringContaining('function.test.handler6.cjs'), // Automatically finds .cjs handler file
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

  expect(Bundling.bundle).toHaveBeenCalledWith(stack, expect.objectContaining({
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
  const entry = bockPath`handler.tsx`;

  expect(() => new NodejsFunction(stack, 'Fn', {
    entry,
  })).not.toThrow();
});

test('throws when entry does not exist', () => {
  expect(() => new NodejsFunction(stack, 'Fn', {
    entry: 'notfound.ts',
  })).toThrow(/Cannot find entry file at/);
});

test('throws when entry cannot be automatically found', () => {
  expect(() => new NodejsFunction(stack, 'Fn')).toThrow(/Cannot find handler file .*function\.test\.Fn\.ts.*function\.test\.Fn\.js.*function\.test\.Fn\.mjs/);
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

  expect(Bundling.bundle).toHaveBeenCalledWith(stack, expect.objectContaining({
    depsLockFilePath: bockPath`/home/project/package.json`,
  }));
});

test('resolves entry to an absolute path', () => {
  // WHEN
  new NodejsFunction(stack, 'fn', {
    entry: 'aws-lambda-nodejs/lib/index.ts',
  });

  expect(Bundling.bundle).toHaveBeenCalledWith(stack, expect.objectContaining({
    entry: bockPath`/home/project/aws-lambda-nodejs/lib/index.ts`,
  }));
});

test('configures connection reuse for aws sdk', () => {
  // WHEN
  new NodejsFunction(stack, 'handler1');

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
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

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Environment: Match.absent(),
  });
});

test('NodejsFunction in a VPC', () => {
  // GIVEN
  const vpc = new Vpc(stack, 'Vpc');

  // WHEN
  new NodejsFunction(stack, 'handler1', { vpc });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
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

test('defaults to NODEJS_16_X with feature flag disabled', () => {
  // WHEN
  new NodejsFunction(stack, 'handler1');

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Runtime: 'nodejs16.x',
  });
});

test('defaults to NODEJS_LATEST with feature flag enabled', () => {
  // GIVEN
  const appLocal = new App({
    context: {
      [LAMBDA_NODEJS_USE_LATEST_RUNTIME]: true,
    },
  });
  const stackLocal = new Stack(appLocal, 'TestStackFF');

  // WHEN
  new NodejsFunction(stackLocal, 'handler1');

  Template.fromStack(stackLocal).hasResourceProperties('AWS::Lambda::Function', {
    Runtime: 'nodejs18.x',
  });
});
