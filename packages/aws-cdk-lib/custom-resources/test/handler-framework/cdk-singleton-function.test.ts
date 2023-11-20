import * as path from 'path';
import { Template } from '../../../assertions';
import { Runtime } from '../../../aws-lambda';
import { Stack } from '../../../core';
import { CdkHandler } from '../../lib/handler-framework/cdk-handler';
import { CdkSingletonFunction } from '../../lib/handler-framework/cdk-singleton-function';

describe('cdk singleton function', () => {
  test('stack contains expected lambda function', () => {
    // GIVEN
    const stack = new Stack();
    const handler = CdkHandler.fromAsset(path.join(__dirname, 'test-handler'), {
      handler: 'index.handler',
      compatibleRuntimes: [Runtime.NODEJS_16_X, Runtime.NODEJS_18_X],
    });

    // WHEN
    new CdkSingletonFunction(stack, 'Function', {
      handler,
      uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Code: {
        S3Bucket: {
          'Fn::Sub': 'cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}',
        },
        S3Key: '02227527d0e41dc9ca1090db083832a1fd9a8ec58cc140edb308086dc100a25b.zip',
      },
      Handler: 'index.handler',
      Role: {
        'Fn::GetAtt': [
          'SingletonLambda84c0de93353f42179b0b45b6c993251aServiceRole26D59235',
          'Arn',
        ],
      },
      Runtime: 'nodejs18.x',
    });
  });

  test('throws if no nodejs or python runtimes are specified in cdk code', () => {
    // GIVEN
    const stack = new Stack();
    const handler = CdkHandler.fromAsset(path.join(__dirname, 'test-handler'), {
      handler: 'index.handler',
      compatibleRuntimes: [Runtime.JAVA_11, Runtime.RUBY_3_2],
    });

    // WHEN / THEN
    expect(() => {
      new CdkSingletonFunction(stack, 'Function', {
        handler,
        uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      });
    }).toThrow('Compatible runtimes must contain either nodejs or python runtimes');
  });

  test('throws if latest nodejs runtime is deprecated', () => {
    // GIVEN
    const stack = new Stack();
    const handler = CdkHandler.fromAsset(path.join(__dirname, 'test-handler'), {
      handler: 'index.handler',
      compatibleRuntimes: [Runtime.NODEJS_12_X, Runtime.NODEJS_14_X],
    });

    // WHEN / THEN
    expect(() => {
      new CdkSingletonFunction(stack, 'Function', {
        handler,
        uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      });
    }).toThrow(`Latest nodejs runtime ${Runtime.NODEJS_14_X} is deprecated`);
  });

  test('throws if latest python runtime is deprecated', () => {
    // GIVEN
    const stack = new Stack();
    const handler = CdkHandler.fromAsset(path.join(__dirname, 'test-handler'), {
      handler: 'index.handler',
      compatibleRuntimes: [Runtime.PYTHON_2_7, Runtime.PYTHON_3_6],
    });

    // WHEN / THEN
    expect(() => {
      new CdkSingletonFunction(stack, 'Function', {
        handler,
        uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      });
    }).toThrow(`Latest python runtime ${Runtime.PYTHON_3_6} is deprecated`);
  });
});