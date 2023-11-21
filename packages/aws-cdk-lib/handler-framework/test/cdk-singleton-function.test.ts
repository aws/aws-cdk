import * as path from 'path';
import { Template } from '../../assertions';
import { Runtime } from '../../aws-lambda';
import { Stack } from '../../core';
import { CdkHandler } from '../lib/cdk-handler';
import { CdkSingletonFunction } from '../lib/cdk-singleton-function';

describe('cdk singleton function', () => {
  test('stack contains expected lambda function', () => {
    // GIVEN
    const stack = new Stack();
    const handler = CdkHandler.fromAsset(path.join(__dirname, 'test-handler'), {
      entrypoint: 'index.handler',
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
        S3Key: '4d4b98cd9c36b776ced5c91f31e9aa292cb824a13cb0d1a4d4d91e128b8e4fb6.zip',
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
});
