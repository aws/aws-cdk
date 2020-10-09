import '@aws-cdk/assert/jest';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as secretsmanager from '../lib';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test('create a rotation schedule', () => {
  // GIVEN
  const secret = new secretsmanager.Secret(stack, 'Secret');
  const rotationLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_10_X,
    code: lambda.Code.fromInline('export.handler = event => event;'),
    handler: 'index.handler',
  });

  // WHEN
  new secretsmanager.RotationSchedule(stack, 'RotationSchedule', {
    secret,
    rotationLambda,
  });

  // THEN
  expect(stack).toHaveResource('AWS::SecretsManager::RotationSchedule', {
    SecretId: {
      Ref: 'SecretA720EF05',
    },
    RotationLambdaARN: {
      'Fn::GetAtt': [
        'LambdaD247545B',
        'Arn',
      ],
    },
    RotationRules: {
      AutomaticallyAfterDays: 30,
    },
  });
});
