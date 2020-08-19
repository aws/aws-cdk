import { expect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as lambda from '../lib';

/* eslint-disable quote-props */

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
          Value: 'arn:aws:lambda:region:account-id:function:function-name:version',
        },
        Name: {
          Value: 'function-name:version',
        },
      },
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
      retryAttempts: 0,
    });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::EventInvokeConfig', {
      FunctionName: {
        Ref: 'Fn9270CBC0',
      },
      Qualifier: {
        'Fn::GetAtt': [
          'Version6A868472',
          'Version',
        ],
      },
      MaximumEventAgeInSeconds: 3600,
      MaximumRetryAttempts: 0,
    }));

    test.done();
  },

  'throws when calling configureAsyncInvoke on already configured version'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Fn', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });
    const version = new lambda.Version(stack, 'Version', {
      lambda: fn,
      maxEventAge: cdk.Duration.hours(1),
      retryAttempts: 0,
    });

    // THEN
    test.throws(() => version.configureAsyncInvoke({ retryAttempts: 1 }), /An EventInvokeConfig has already been configured/);

    test.done();
  },

  'event invoke config on imported versions'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const version1 = lambda.Version.fromVersionArn(stack, 'Version1', 'arn:aws:lambda:region:account-id:function:function-name:version1');
    const version2 = lambda.Version.fromVersionArn(stack, 'Version2', 'arn:aws:lambda:region:account-id:function:function-name:version2');

    // WHEN
    version1.configureAsyncInvoke({
      retryAttempts: 1,
    });
    version2.configureAsyncInvoke({
      retryAttempts: 0,
    });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::EventInvokeConfig', {
      FunctionName: 'function-name',
      Qualifier: 'version1',
      MaximumRetryAttempts: 1,
    }));
    expect(stack).to(haveResource('AWS::Lambda::EventInvokeConfig', {
      FunctionName: 'function-name',
      Qualifier: 'version2',
      MaximumRetryAttempts: 0,
    }));

    test.done();
  },

  'addAlias can be used to add an alias that points to a version'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Fn', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });
    const version = fn.currentVersion;

    // WHEN
    version.addAlias('foo');

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::Alias', {
      'FunctionName': {
        'Ref': 'Fn9270CBC0',
      },
      'FunctionVersion': {
        'Fn::GetAtt': [
          'FnCurrentVersion17A89ABBab5c765f3c55e4e61583b51b00a95742',
          'Version',
        ],
      },
      'Name': 'foo',
    }));
    test.done();
  },

  'edgeArn'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Fn', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });
    const version = fn.addVersion('1');

    // THEN
    test.deepEqual(stack.resolve(version.edgeArn), { Ref: 'FnVersion1C3F5F93D' });

    test.done();
  },

  'edgeArn throws with $LATEST'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const version = lambda.Version.fromVersionArn(stack, 'Version', 'arn:aws:lambda:region:account-id:function:function-name:$LATEST');

    // THEN
    test.throws(() => version.edgeArn, /\$LATEST function version cannot be used for Lambda@Edge/);

    test.done();
  },

  'edgeArn throws at synthesis if underlying function is not edge compatible'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const fn = new lambda.Function(stack, 'Fn', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });
    const version = fn.addVersion('1');

    // WHEN
    new lambda.Function(stack, 'OtherFn', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
      environment: {
        EDGE_ARN: version.edgeArn, // Consume edgeArn
      },
    });
    // make fn incompatible for Lambda@Edge after consuming edgeArn
    fn.addEnvironment('KEY1', 'value1');
    fn.addEnvironment('KEY2', 'value2');

    // THEN
    test.throws(() => app.synth(), /KEY1,KEY2/);

    test.done();
  },
};
