import * as path from 'path';
import { Template } from '../../../assertions';
import { Runtime } from '../../../aws-lambda';
import { Stack } from '../../../core';
import { CdkFunction } from '../../lib/handler-framework/cdk-function';
import { CdkHandler } from '../../lib/handler-framework/cdk-handler';

describe('cdk function', () => {
  test('stack contains expected lambda function', () => {
    // GIVEN
    const stack = new Stack();
    const handler = CdkHandler.fromAsset(path.join(__dirname, 'test-handler'), {
      handler: 'index.handler',
      compatibleRuntimes: [Runtime.NODEJS_16_X, Runtime.NODEJS_18_X],
    });

    // WHEN
    new CdkFunction(stack, 'Function', { handler });

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
          'FunctionServiceRole675BB04A',
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
      
      compatibleRuntimes: [Runtime.JAVA_11, Runtime.RUBY_3_2],
    });

    // WHEN / THEN
    expect(() => {
      new CdkFunction(stack, 'Function', {
        handler: 'index.handler',
        code,
      });
    }).toThrow('Compatible runtimes must contain either nodejs or python runtimes');
  });

  test('throws if latest nodejs runtime is deprecated', () => {
    // GIVEN
    const stack = new Stack();
    const code = CdkCode.fromAsset(path.join(__dirname, 'test-handler'), {
      compatibleRuntimes: [Runtime.NODEJS_12_X, Runtime.NODEJS_14_X],
    });

    // WHEN / THEN
    expect(() => {
      new CdkFunction(stack, 'Function', {
        handler: 'index.handler',
        code,
      });
    }).toThrow(`Latest nodejs runtime ${Runtime.NODEJS_14_X} is deprecated`);
  });

  test('throws if latest python runtime is deprecated', () => {
    // GIVEN
    const stack = new Stack();
    const code = CdkCode.fromAsset(path.join(__dirname, 'test-handler'), {
      compatibleRuntimes: [Runtime.PYTHON_2_7, Runtime.PYTHON_3_6],
    });

    // WHEN / THEN
    expect(() => {
      new CdkFunction(stack, 'Function', {
        handler: 'index.handler',
        code,
      });
    }).toThrow(`Latest python runtime ${Runtime.PYTHON_3_6} is deprecated`);
  });
});
