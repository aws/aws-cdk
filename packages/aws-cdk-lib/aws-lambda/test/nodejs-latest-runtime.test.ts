import { Template } from '../../assertions';
import * as cdk from '../../core';
import * as lambda from '../lib';

describe('NODEJS_LATEST runtime resolution', () => {
  test('uses determineLatestNodeRuntime when runtime is NODEJS_LATEST', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack', { env: { region: 'us-east-1' } });

    // WHEN
    const fn = new lambda.Function(stack, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = function() {}'),
    });

    // THEN
    // With a specific region, runtime resolves to concrete value
    expect(fn.runtime.name).toBe('nodejs22.x');
    expect(fn.runtime.family).toBe(lambda.RuntimeFamily.NODEJS);
  });

  test('uses provided runtime when not NODEJS_LATEST', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack', { env: { region: 'us-east-1' } });

    // WHEN
    const fn = new lambda.Function(stack, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = function() {}'),
    });

    // THEN
    expect(fn.runtime).toBe(lambda.Runtime.NODEJS_20_X);
    expect(fn.runtime.name).toBe('nodejs20.x');
  });

  test('runtime property returns determined runtime for NODEJS_LATEST', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack', { env: { region: 'us-east-1' } });

    // WHEN
    const fn = new lambda.Function(stack, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = function() {}'),
    });

    // THEN
    expect(fn.runtime.name).toBe('nodejs22.x');
    expect(fn.runtime.family).toBe(lambda.RuntimeFamily.NODEJS);
  });

  test('runtime property returns original runtime for non-NODEJS_LATEST', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack', { env: { region: 'us-east-1' } });

    // WHEN
    const fn = new lambda.Function(stack, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = function() {}'),
    });

    // THEN
    expect(fn.runtime).toBe(lambda.Runtime.NODEJS_20_X);
    expect(fn.runtime.name).toBe('nodejs20.x');
  });

  test('NODEJS_LATEST resolution works in different regions', () => {
    // GIVEN
    const app = new cdk.App();
    const usEast1Stack = new cdk.Stack(app, 'USEast1Stack', { env: { region: 'us-east-1' } });
    const euWest1Stack = new cdk.Stack(app, 'EUWest1Stack', { env: { region: 'eu-west-1' } });

    // WHEN
    const usFunction = new lambda.Function(usEast1Stack, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = function() {}'),
    });

    const euFunction = new lambda.Function(euWest1Stack, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = function() {}'),
    });

    // THEN
    // Both should resolve to the same concrete runtime
    expect(usFunction.runtime.name).toBe('nodejs22.x');
    expect(euFunction.runtime.name).toBe('nodejs22.x');
    expect(usFunction.runtime.family).toBe(lambda.RuntimeFamily.NODEJS);
    expect(euFunction.runtime.family).toBe(lambda.RuntimeFamily.NODEJS);
  });

  test('NODEJS_LATEST creates regional mapping in environment-agnostic stack', () => {
    // GIVEN
    const stack = new cdk.Stack(); // No region specified

    // WHEN
    new lambda.Function(stack, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = function() {}'),
    });

    // THEN
    // Should create the LatestNodeRuntimeMap mapping for environment-agnostic stacks
    Template.fromStack(stack).hasMapping('LatestNodeRuntimeMap', {});

    // Verify the CloudFormation template uses Fn::FindInMap for runtime
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Runtime: {
        'Fn::FindInMap': [
          'LatestNodeRuntimeMap',
          { Ref: 'AWS::Region' },
          'value',
        ],
      },
    });
  });
});
