import '@aws-cdk/assert/jest';
import * as path from 'path';
import { CfnOutput, Stack } from '@aws-cdk/core';
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
      expect(calculateFunctionHash(fn1)).toEqual('d0cf052aead13ed6112b2e8a2f728908');
    });
  });

  test('code impacts hash', () => {
    const stack1 = new Stack();
    const fn1 = new lambda.Function(stack1, 'MyFunction1', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
    });

    expect(calculateFunctionHash(fn1)).not.toEqual('d0cf052aead13ed6112b2e8a2f728908');
    expect(calculateFunctionHash(fn1)).toEqual('14b543c4b1a9e5425d92ef93557eb5bd');
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

  describe('impact of env variables order on hash', () => {

    test('without "currentVersion", we preserve old behavior to avoid unnesesary invalidation of templates', () => {
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

      expect(calculateFunctionHash(fn1)).not.toEqual(calculateFunctionHash(fn2));
    });

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
