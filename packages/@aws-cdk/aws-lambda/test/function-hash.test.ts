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

  describe('calculateFunctionHash', () => {
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

      expect(calculateFunctionHash('v1', fn1)).toEqual(calculateFunctionHash('v1', fn2));
      expect(calculateFunctionHash('v1', fn1)).toEqual('aea5463dba236007afe91d2832b3c836');

      expect(calculateFunctionHash('v2', fn1)).toEqual(calculateFunctionHash('v2', fn2));
      expect(calculateFunctionHash('v2', fn1)).toEqual('e5235e3cb7a9b70c42c1a665a3ebd77c');
    });

    test('code impacts hash', () => {
      const stack1 = new Stack();
      const fn1 = new lambda.Function(stack1, 'MyFunction1', {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
        handler: 'index.handler',
      });

      const stack2 = new Stack();
      const fn2 = new lambda.Function(stack2, 'MyFunction1', {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });

      expect(calculateFunctionHash('v1', fn1)).toEqual('979b4a14c6f174c745cdbcd1036cf844');
      expect(calculateFunctionHash('v1', fn1)).not.toEqual(calculateFunctionHash('v1', fn2));

      expect(calculateFunctionHash('v2', fn1)).toEqual('bb95ae2489ebc480a23ff373362e453a');
      expect(calculateFunctionHash('v2', fn1)).not.toEqual(calculateFunctionHash('v2', fn2));
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

      expect(calculateFunctionHash('v1', fn1)).toEqual('d1bc824ac5022b7d62d8b12dbae6580c');
      expect(calculateFunctionHash('v1', fn2)).toEqual('3b683d05465012b0aa9c4ff53b32f014');
      expect(calculateFunctionHash('v1', fn1)).not.toEqual(calculateFunctionHash('v1', fn2));

      expect(calculateFunctionHash('v2', fn1)).toEqual('c04c74d9b1f5e69fe89553046729d56c');
      expect(calculateFunctionHash('v2', fn2)).toEqual('846d480578d941bf81c787064fed6d97');
      expect(calculateFunctionHash('v2', fn1)).not.toEqual(calculateFunctionHash('v2', fn2));
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

      expect(calculateFunctionHash('v1', fn1)).toEqual('d1bc824ac5022b7d62d8b12dbae6580c');
      expect(calculateFunctionHash('v1', fn2)).toEqual('0f168f0772463e8e547bb3800937e54d');
      expect(calculateFunctionHash('v1', fn1)).not.toEqual(calculateFunctionHash('v1', fn2));

      expect(calculateFunctionHash('v2', fn1)).toEqual('c04c74d9b1f5e69fe89553046729d56c');
      expect(calculateFunctionHash('v2', fn2)).toEqual('02ea61c7495c095816f88e42abaeb815');
      expect(calculateFunctionHash('v2', fn1)).not.toEqual(calculateFunctionHash('v2', fn2));
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

      expect(calculateFunctionHash('v1', fn1)).not.toEqual(calculateFunctionHash('v1', fn2));

      expect(calculateFunctionHash('v2', fn1)).not.toEqual(calculateFunctionHash('v2', fn2));
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

        expect(calculateFunctionHash('v1', fn1)).toEqual(calculateFunctionHash('v1', fn2));

        expect(calculateFunctionHash('v2', fn1)).toEqual(calculateFunctionHash('v2', fn2));
      });
    });

    describe('v2', () => {
      test('excluded properties do not affect function hash', () => {
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

        expect(calculateFunctionHash('v2', fn2)).toEqual(calculateFunctionHash('v2', fn1));
      });

      test('tags do not affect function hash', () => {
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

        expect(stack).toHaveResource('AWS::Lambda::Function', {
          Tags: [
            { Key: 'key', Value: 'val' },
          ],
        });
        expect(calculateFunctionHash('v2', fn2)).toEqual(calculateFunctionHash('v2', fn1));
      });

      test('CloudFormation "DependsOn" does not affect function hash', () => {
        const stack = new Stack();
        const fn = new lambda.Function(stack, 'MyFunction', {
          runtime: lambda.Runtime.NODEJS_12_X,
          code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
          handler: 'index.handler',
        });
        const expected = calculateFunctionHash('v2', fn);
        const role = new iam.User(stack, 'MyUser');

        fn.node.addDependency(role);

        expect(calculateFunctionHash('v2', fn)).toEqual(expected);
      });
    });
  });
});
