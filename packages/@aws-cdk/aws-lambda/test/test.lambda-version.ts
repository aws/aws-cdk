import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import lambda = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'can import a Lambda version by ARN'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const version = lambda.Version.fromVersionArn(stack, 'Version', 'arn:aws:lambda:region:account-id:function:function-name:version');

    new cdk.CfnOutput(stack, 'ARN', { value: version.functionArn });
    new cdk.CfnOutput(stack, 'Name', { value: version.functionName });

    // THEN
    expect(stack).toMatch({
      Outputs: {
        ARN: {
          Value: "arn:aws:lambda:region:account-id:function:function-name:version"
        },
        Name: {
          Value: "function-name:version"
        }
      }
    });

    test.done();
  },

  'create a version with event invoke config'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Fn', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });

    // WHEN
    new lambda.Version(stack, 'Version', {
      lambda: fn,
      maxEventAge: cdk.Duration.hours(1),
      retryAttempts: 0
    });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::EventInvokeConfig', {
      FunctionName: {
        Ref: 'Fn9270CBC0'
      },
      Qualifier: {
        'Fn::GetAtt': [
          'Version6A868472',
          'Version'
        ]
      },
      MaximumEventAgeInSeconds: 3600,
      MaximumRetryAttempts: 0
    }));

    test.done();
  },

  'event invoke config on imported versions'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const version1 = lambda.Version.fromVersionArn(stack, 'Version1', 'arn:aws:lambda:region:account-id:function:function-name:version1');
    const version2 = lambda.Version.fromVersionArn(stack, 'Version2', 'arn:aws:lambda:region:account-id:function:function-name:version2');

    // WHEN
    version1.configureAsyncInvoke({
      retryAttempts: 1
    });
    version2.configureAsyncInvoke({
      retryAttempts: 0
    });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::EventInvokeConfig', {
      FunctionName: 'function-name',
      Qualifier: 'version1',
      MaximumRetryAttempts: 1
    }));
    expect(stack).to(haveResource('AWS::Lambda::EventInvokeConfig', {
      FunctionName: 'function-name',
      Qualifier: 'version2',
      MaximumRetryAttempts: 0
    }));

    test.done();
  }
};
