import { expect, haveResource } from '@aws-cdk/assert';
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import secretsmanager = require('../lib');

export = {
  'create a rotation schedule'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const secret = new secretsmanager.Secret(stack, 'Secret');
    const rotationLambda = new lambda.Function(stack, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('export.handler = event => event;'),
      handler: 'index.handler'
    });

    // WHEN
    new secretsmanager.RotationSchedule(stack, 'RotationSchedule', {
      secret,
      rotationLambda
    });

    // THEN
    expect(stack).to(haveResource('AWS::SecretsManager::RotationSchedule', {
      SecretId: {
        Ref: 'SecretA720EF05'
      },
      RotationLambdaARN: {
        'Fn::GetAtt': [
          'LambdaD247545B',
          'Arn'
        ]
      },
      RotationRules: {
        AutomaticallyAfterDays: 30
      }
    }));

    test.done();
  },
};
