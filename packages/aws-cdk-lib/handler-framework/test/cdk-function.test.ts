import * as path from 'path';
import { Template } from '../../assertions';
import { Runtime } from '../../aws-lambda';
import { Stack } from '../../core';
import { CdkFunction } from '../lib/cdk-function';
import { CdkHandler } from '../lib/cdk-handler';

describe('cdk function', () => {
  test('stack contains expected lambda function', () => {
    // GIVEN
    const stack = new Stack();
    const handler = new CdkHandler(stack, 'CdkHandler', {
      codeDirectory: path.join(__dirname, 'test-handler'),
      entrypoint: 'index.handler',
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
        S3Key: '4d4b98cd9c36b776ced5c91f31e9aa292cb824a13cb0d1a4d4d91e128b8e4fb6.zip',
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
});
