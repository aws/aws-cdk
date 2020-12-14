import '@aws-cdk/assert/jest';
import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import { CfnOutput, Stack, Tags } from '@aws-cdk/core';
import * as lambda from '../lib';
import { calculateFunctionHash, trimFromStart } from '../lib/function-hash';

describe('function hash', () => {
  describe('trimFromStart', () => {

    test('trim not needed', () => {
      expect(trimFromStart('foo', 100)).toEqual('foo');
      expect(trimFromStart('foo', 3)).toEqual('foo');
      expect(trimFromStart('', 3)).toEqual('');
    });

    test('trim required', () => {
      expect(trimFromStart('hello', 3)).toEqual('llo');
      expect(trimFromStart('hello', 4)).toEqual('ello');
      expect(trimFromStart('hello', 1)).toEqual('o');
    });
  });

  describe('calcHash', () => {
    test('same configuration and code yields the same hash', () => {
      const stack1 = new Stack();
      const fn1 = new lambda.Function(stack1, 'MyFunction1', {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });

      const stack2 = new Stack();
      const fn2 = new lambda.Function(stack2, 'MyFunction1', {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });

      expect(calculateFunctionHash(fn1)).toEqual(calculateFunctionHash(fn2));
      expect(calculateFunctionHash(fn1)).toEqual('e5235e3cb7a9b70c42c1a665a3ebd77c');
    });
  });

  test('code impacts hash', () => {
    const stack1 = new Stack();
    const fn1 = new lambda.Function(stack1, 'MyFunction1', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
    });

    expect(calculateFunctionHash(fn1)).not.toEqual('e5235e3cb7a9b70c42c1a665a3ebd77c');
    expect(calculateFunctionHash(fn1)).toEqual('bb95ae2489ebc480a23ff373362e453a');
  });

  test('environment variables impact hash', () => {
    const stack1 = new Stack();
    const fn1 = new lambda.Function(stack1, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      environment: {
        Foo: 'bar',
      },
    });

    const stack2 = new Stack();
    const fn2 = new lambda.Function(stack2, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      environment: {
        Foo: 'beer',
      },
    });

    expect(calculateFunctionHash(fn1)).not.toEqual(calculateFunctionHash(fn2));
  });

  test('runtime impacts hash', () => {
    const stack1 = new Stack();
    const fn1 = new lambda.Function(stack1, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      environment: {
        Foo: 'bar',
      },
    });

    const stack2 = new Stack();
    const fn2 = new lambda.Function(stack2, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      environment: {
        Foo: 'beer',
      },
    });

    expect(calculateFunctionHash(fn1)).not.toEqual(calculateFunctionHash(fn2));
  });

  test('inline code change impacts the hash', () => {
    const stack1 = new Stack();
    const fn1 = new lambda.Function(stack1, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromInline('foo'),
      handler: 'index.handler',
    });

    const stack2 = new Stack();
    const fn2 = new lambda.Function(stack2, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('foo bar'),
      handler: 'index.handler',
    });

    expect(calculateFunctionHash(fn1)).not.toEqual(calculateFunctionHash(fn2));
  });

  test('CloudFormation "DependsOn" does not affect function hash', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
    });
    const expected = calculateFunctionHash(fn);
    const role = new iam.User(stack, 'MyUser');

    // WHEN
    fn.node.addDependency(role);

    // THEN
    expect(calculateFunctionHash(fn)).toEqual(expected);
  });

  test('excluded properties do not affect function hash', () => {
    // GIVEN
    const stack = new Stack();
    const role = new iam.Role(stack, 'FunctionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const fn1 = new lambda.Function(stack, 'MyFunction1', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      role,
      reservedConcurrentExecutions: 10,
    });
    const fn2 = new lambda.Function(stack, 'MyFunction2', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      role,
      reservedConcurrentExecutions: 5,
    });

    // THEN
    expect(calculateFunctionHash(fn2)).toEqual(calculateFunctionHash(fn1));
  });

  test('tags do not affect function hash', () => {
    // GIVEN
    const stack = new Stack();
    const role = new iam.Role(stack, 'FunctionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const fn1 = new lambda.Function(stack, 'MyFunction1', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      role,
      reservedConcurrentExecutions: 10,
    });
    const fn2 = new lambda.Function(stack, 'MyFunction2', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      role,
      reservedConcurrentExecutions: 5,
    });
    Tags.of(fn2).add('key', 'val');

    // THEN
    expect(stack).toHaveResource('AWS::Lambda::Function', {
      Tags: [
        { Key: 'key', Value: 'val' },
      ],
    });
    expect(calculateFunctionHash(fn2)).toEqual(calculateFunctionHash(fn1));
  });

  describe('impact of env variables order on hash', () => {
    test('with "currentVersion", we sort env keys so order is consistent', () => {
      const stack1 = new Stack();
      const fn1 = new lambda.Function(stack1, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
        handler: 'index.handler',
        environment: {
          Foo: 'bar',
          Bar: 'foo',
        },
      });

      new CfnOutput(stack1, 'VersionArn', { value: fn1.currentVersion.functionArn });

      const stack2 = new Stack();
      const fn2 = new lambda.Function(stack2, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
        handler: 'index.handler',
        environment: {
          Bar: 'foo',
          Foo: 'bar',
        },
      });

      new CfnOutput(stack2, 'VersionArn', { value: fn2.currentVersion.functionArn });

      expect(calculateFunctionHash(fn1)).toEqual(calculateFunctionHash(fn2));
    });
  });
});
