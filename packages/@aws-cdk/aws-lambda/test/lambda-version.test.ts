import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import { Duration } from '@aws-cdk/core';
import * as lambda from '../lib';
import { Architecture } from '../lib';

describe('lambda version', () => {
  test('can import a Lambda version by ARN', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const version = lambda.Version.fromVersionArn(stack, 'Version', 'arn:aws:lambda:region:account-id:function:function-name:version');

    new cdk.CfnOutput(stack, 'ARN', { value: version.functionArn });
    new cdk.CfnOutput(stack, 'Name', { value: version.functionName });

    // THEN
    Template.fromStack(stack).templateMatches({
      Outputs: {
        ARN: {
          Value: 'arn:aws:lambda:region:account-id:function:function-name:version',
        },
        Name: {
          Value: 'function-name:version',
        },
      },
    });
  });

  describe('fromVersionAttributes', () => {
    let stack: cdk.Stack;
    let func: lambda.IFunction;
    let version: lambda.IVersion;
    let role: iam.Role;
    beforeEach(() => {
      stack = new cdk.Stack();
      role = new iam.Role(stack, 'SomeRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });
      func = lambda.Function.fromFunctionAttributes(stack, 'iFunc', {
        functionArn: 'arn:aws:lambda:region:account-id:function:function-name',
        architecture: Architecture.ARM_64,
        timeout: Duration.minutes(5),
        role: role,
      });
      version = lambda.Version.fromVersionAttributes(stack, 'Version', {
        lambda: func,
        version: 'version',
      });
    });

    test('sets arn correctly', () => {
      expect(version.functionArn).toBe('arn:aws:lambda:region:account-id:function:function-name:version');
    });

    test('sets version correctly', () => {
      expect(version.version).toBe('version');
    });

    test('sets lambda correctly', () => {
      expect(version.lambda).toBe(func);
    });

    test('sets name correctly', () => {
      expect(version.functionName).toBe('function-name:version');
    });

    test('sets role correctly', () => {
      expect(version.role).toBe(role);
    });

    test('sets architecture correctly', () => {
      expect(version.architecture).toBe(Architecture.ARM_64);
    });

    test('sets timeout correctly', () => {
      expect(version.timeout).toEqual(Duration.minutes(5));
    });
  });

  test('create a version with event invoke config', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Fn', {
      runtime: lambda.Runtime.NODEJS_14_X,
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
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
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
    });
  });

  test('creating a version propagates lambda timeout prop', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Fn', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
      timeout: Duration.minutes(5),
    });

    // WHEN
    const version = new lambda.Version(stack, 'Version', {
      lambda: fn,
    });

    // THEN
    expect(version.timeout).toEqual(Duration.minutes(5));
  });

  test('throws when calling configureAsyncInvoke on already configured version', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Fn', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });
    const version = new lambda.Version(stack, 'Version', {
      lambda: fn,
      maxEventAge: cdk.Duration.hours(1),
      retryAttempts: 0,
    });

    // THEN
    expect(() => version.configureAsyncInvoke({ retryAttempts: 1 })).toThrow(/An EventInvokeConfig has already been configured/);
  });

  test('event invoke config on imported versions', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
      FunctionName: 'function-name',
      Qualifier: 'version1',
      MaximumRetryAttempts: 1,
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
      FunctionName: 'function-name',
      Qualifier: 'version2',
      MaximumRetryAttempts: 0,
    });
  });

  testDeprecated('addAlias can be used to add an alias that points to a version', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Fn', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });
    const version = fn.currentVersion;

    // WHEN
    version.addAlias('foo');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Alias', {
      FunctionName: {
        Ref: 'Fn9270CBC0',
      },
      FunctionVersion: {
        'Fn::GetAtt': [
          'FnCurrentVersion17A89ABB7cfc294c86ef030f28b22c2ab54f718a',
          'Version',
        ],
      },
      Name: 'foo',
    });
  });

  test('edgeArn', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Fn', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });
    const version = fn.currentVersion;

    // THEN
    expect(stack.resolve(version.edgeArn)).toEqual({ Ref: 'FnCurrentVersion17A89ABB7cfc294c86ef030f28b22c2ab54f718a' });
  });

  test('edgeArn throws with $LATEST', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const version = lambda.Version.fromVersionArn(stack, 'Version', 'arn:aws:lambda:region:account-id:function:function-name:$LATEST');

    // THEN
    expect(() => version.edgeArn).toThrow(/\$LATEST function version cannot be used for Lambda@Edge/);
  });

  test('edgeArn throws at synthesis if underlying function is not edge compatible', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const fn = new lambda.Function(stack, 'Fn', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });
    const version = fn.currentVersion;

    // WHEN
    new lambda.Function(stack, 'OtherFn', {
      runtime: lambda.Runtime.NODEJS_14_X,
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
    expect(() => app.synth()).toThrow(/KEY1,KEY2/);
  });

  test('throws when adding FunctionUrl to a Version', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_14_X,
    });
    const version = new lambda.Version(stack, 'Version', {
      lambda: fn,
      maxEventAge: cdk.Duration.hours(1),
      retryAttempts: 0,
    });

    // WHEN
    expect(() => {
      version.addFunctionUrl();
    }).toThrow(/FunctionUrl cannot be used with a Version/);
  });
});
