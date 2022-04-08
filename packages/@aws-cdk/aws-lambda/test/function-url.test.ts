import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

describe('FunctionUrl', () => {
  test('default function url', () => {
    // GIVEN
    const stack = new cdk.Stack();
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
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // WHEN
    new lambda.FunctionUrl(stack, 'FunctionUrl', {
      function: fn,
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowCredentials: true,
        allowedOrigins: ['https://example.com'],
        allowedMethods: [lambda.HttpMethods.GET],
        allowedHeaders: ['X-Custom-Header'],
        maxAge: cdk.Duration.seconds(300),
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
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunctionUrl',
      FunctionName: {
        'Fn::GetAtt': [
          'MyLambdaCCE802FB',
          'Arn',
        ],
      },
      Principal: '*',
      FunctionUrlAuthType: 'NONE',
    });
  });

  test('function url with alias', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });
    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version: fn.currentVersion,
    });

    // WHEN
    new lambda.FunctionUrl(stack, 'FunctionUrl', {
      function: alias,
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Url', {
      AuthType: 'AWS_IAM',
      TargetFunctionArn: {
        Ref: 'Alias325C5727',
      },
      Qualifier: 'prod',
    });
  });

  test('throws when configured with Version', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });
    const version = new lambda.Version(stack, 'Version', {
      lambda: fn,
      maxEventAge: cdk.Duration.hours(1),
      retryAttempts: 0,
    });

    // WHEN
    expect(() => {
      new lambda.FunctionUrl(stack, 'FunctionUrl', {
        function: version,
        authType: lambda.FunctionUrlAuthType.AWS_IAM,
      });
    }).toThrow(/FunctionUrl cannot be used with a Version/);
  });
});