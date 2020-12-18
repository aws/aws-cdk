import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

describe('lambda version', () => {
  test('can import a Lambda version by ARN', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const version = lambda.Version.fromVersionArn(stack, 'Version', 'arn:aws:lambda:region:account-id:function:function-name:version');

    new cdk.CfnOutput(stack, 'ARN', { value: version.functionArn });
    new cdk.CfnOutput(stack, 'Name', { value: version.functionName });

    // THEN
    expect(stack).toMatchTemplate({
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

  test('create a version with event invoke config', () => {
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
    expect(stack).toHaveResource('AWS::Lambda::EventInvokeConfig', {
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

  test('throws when calling configureAsyncInvoke on already configured version', () => {
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
    expect(stack).toHaveResource('AWS::Lambda::EventInvokeConfig', {
      FunctionName: 'function-name',
      Qualifier: 'version1',
      MaximumRetryAttempts: 1,
    });
    expect(stack).toHaveResource('AWS::Lambda::EventInvokeConfig', {
      FunctionName: 'function-name',
      Qualifier: 'version2',
      MaximumRetryAttempts: 0,
    });
  });

  test('addAlias can be used to add an alias that points to a version', () => {
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
    expect(stack).toHaveResource('AWS::Lambda::Alias', {
      FunctionName: {
        Ref: 'Fn9270CBC0',
      },
      FunctionVersion: {
        'Fn::GetAtt': [
          'FnCurrentVersion17A89ABBb45e048875a05d600055158033f7475a',
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
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });
    const version = fn.currentVersion;

    // THEN
    expect(stack.resolve(version.edgeArn)).toEqual({ Ref: 'FnCurrentVersion17A89ABB19ed45993ff69fd011ae9fd4ab6e2005' });
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
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });
    const version = fn.currentVersion;

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
    expect(() => app.synth()).toThrow(/KEY1,KEY2/);
  });

  describe('function hash', () => {
    test('no hashConfig is configured when currentVersion() is not used', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new lambda.Function(stack, 'Fn', {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('foo'),
      });

      // WHEN
      const version = new lambda.Version(fn, 'Version', {
        lambda: fn,
      });

      // THEN
      expect((version as any).hashConfig).toBeUndefined();
    });

    test('algorithm is v2 when using currentVersion()', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new lambda.Function(stack, 'Fn', {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('foo'),
      });

      // WHEN
      const version = fn.currentVersion;

      // THEN
      expect((version as any).hashConfig.hashAlgorithm).toEqual('v2');
    });

    test('algorithm is v1 when using currentVersion() + edgeArn()', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new lambda.Function(stack, 'Fn', {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('foo'),
      });

      // WHEN
      const version = fn.currentVersion;
      version.edgeArn;

      // THEN
      expect((version as any).hashConfig.hashAlgorithm).toEqual('v1');
    });

    test('algorithm is still none when using edgeArn()', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new lambda.Function(stack, 'Fn', {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('foo'),
      });
      const version = new lambda.Version(fn, 'Version', {
        lambda: fn,
      });

      // WHEN
      version.edgeArn;

      // THEN
      expect((version as any).hashConfig).toBeUndefined();
    });

    test('function hash is impacted by additional property classified as locked', () => {
      // GIVEN
      const stack1 = new cdk.Stack();
      const fn1 = new lambda.Function(stack1, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromInline('foo'),
        handler: 'index.handler',
      });
      const stack2 = new cdk.Stack();
      const fn2 = new lambda.Function(stack2, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromInline('foo'),
        handler: 'index.handler',
        versionLockClassification: {
          Something: true,
        },
      });

      // WHEN
      (fn2.node.defaultChild as lambda.CfnFunction).addPropertyOverride('Something', 'Else');

      // THEN
      const fn2VerLogicalId = stack2.resolve((fn2.currentVersion.node.defaultChild as cdk.CfnResource).logicalId);
      const fn1VerLogicalId = stack1.resolve((fn1.currentVersion.node.defaultChild as cdk.CfnResource).logicalId);
      expect(fn2VerLogicalId).not.toEqual(fn1VerLogicalId);
      expect(fn2VerLogicalId).toEqual('MyFunctionCurrentVersion197490AFc4062f80672ac83787e4ec071376cf16');
      expect(fn1VerLogicalId).toEqual('MyFunctionCurrentVersion197490AF03d5d63f49b46433073c306e78e320c9');
    });

    test('function hash is not impacted by additional property classified as not locked', () => {
      // GIVEN
      const stack1 = new cdk.Stack();
      const fn1 = new lambda.Function(stack1, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromInline('foo'),
        handler: 'index.handler',
      });
      const stack2 = new cdk.Stack();
      const fn2 = new lambda.Function(stack2, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromInline('foo'),
        handler: 'index.handler',
        versionLockClassification: {
          Something: false,
        },
      });

      // WHEN
      (fn2.node.defaultChild as lambda.CfnFunction).addPropertyOverride('Something', 'Else');

      // THEN
      const fn2VerLogicalId = stack2.resolve((fn2.currentVersion.node.defaultChild as cdk.CfnResource).logicalId);
      const fn1VerLogicalId = stack1.resolve((fn1.currentVersion.node.defaultChild as cdk.CfnResource).logicalId);
      expect(fn2VerLogicalId).toEqual(fn1VerLogicalId);
    });
  });
});
