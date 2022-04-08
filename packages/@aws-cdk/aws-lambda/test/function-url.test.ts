import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import * as lambda from '../lib';

describe('FunctionUrl', () => {
  test('default function url', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // WHEN
    new lambda.FunctionUrl(stack, 'FunctionUrl', {
      function: fn,
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Url', {
      AuthType: 'AWS_IAM',
      TargetFunctionArn: {
        'Fn::GetAtt': [
          'MyLambdaCCE802FB',
          'Arn',
        ],
      },
    });
  });

  test('all function url options', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // WHEN
    new lambda.FunctionUrl(stack, 'FunctionUrl', {
      function: fn,
      authType: lambda.FunctionUrlAuthType.NONE,
      qualifier: 'alias',
      cors: {
        allowCredentials: true,
        allowedOrigins: ['https://example.com'],
        allowedMethods: [lambda.HttpMethods.GET],
        allowedHeaders: ['X-Custom-Header'],
        maxAge: 300,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Url', {
      AuthType: 'NONE',
      TargetFunctionArn: {
        'Fn::GetAtt': [
          'MyLambdaCCE802FB',
          'Arn',
        ],
      },
      Cors: {
        AllowCredentials: true,
        AllowHeaders: [
          'X-Custom-Header',
        ],
        AllowMethods: [
          'GET',
        ],
        AllowOrigins: [
          'https://example.com',
        ],
        MaxAge: 300,
      },
      Qualifier: 'alias',
    });
  });
});