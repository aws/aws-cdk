import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { STANDARD_NODEJS_RUNTIME } from '../../config';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-lambda-dlq');

class StackUnderTest extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new lambda.Function(stack, 'LambdaWithDlq', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: STANDARD_NODEJS_RUNTIME,
      deadLetterQueueEnabled: true,
    });
  }
}

new IntegTest(app, 'aws-cdk-lambda-dlq-integ-test', {
  testCases: [new StackUnderTest(app, 'LambdaWithDlqStack')],
});
