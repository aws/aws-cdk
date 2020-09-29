import * as path from 'path';
import { CfnOutput, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as lambda from '../lib';
import { calculateFunctionHash, trimFromStart } from '../lib/function-hash';

export = {
  'trimFromStart': {

    'trim not needed'(test: Test) {
      test.deepEqual(trimFromStart('foo', 100), 'foo');
      test.deepEqual(trimFromStart('foo', 3), 'foo');
      test.deepEqual(trimFromStart('', 3), '');
      test.done();
    },

    'trim required'(test: Test) {
      test.deepEqual(trimFromStart('hello', 3), 'llo');
      test.deepEqual(trimFromStart('hello', 4), 'ello');
      test.deepEqual(trimFromStart('hello', 1), 'o');
      test.done();
    },

  },

  'calcHash': {
    'same configuration and code yields the same hash'(test: Test) {
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

      test.deepEqual(calculateFunctionHash(fn1), calculateFunctionHash(fn2));
      test.deepEqual(calculateFunctionHash(fn1), 'aea5463dba236007afe91d2832b3c836');
      test.done();
    },
  },

  'code impacts hash'(test: Test) {
    const stack1 = new Stack();
    const fn1 = new lambda.Function(stack1, 'MyFunction1', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
    });

    test.notDeepEqual(calculateFunctionHash(fn1), 'aea5463dba236007afe91d2832b3c836');
    test.deepEqual(calculateFunctionHash(fn1), '979b4a14c6f174c745cdbcd1036cf844');
    test.done();
  },

  'environment variables impact hash'(test: Test) {
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

    test.deepEqual(calculateFunctionHash(fn1), 'd1bc824ac5022b7d62d8b12dbae6580c');
    test.deepEqual(calculateFunctionHash(fn2), '3b683d05465012b0aa9c4ff53b32f014');
    test.done();
  },

  'runtime impacts hash'(test: Test) {
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

    test.deepEqual(calculateFunctionHash(fn1), 'd1bc824ac5022b7d62d8b12dbae6580c');
    test.deepEqual(calculateFunctionHash(fn2), '0f168f0772463e8e547bb3800937e54d');
    test.done();
  },

  'inline code change impacts the hash'(test: Test) {
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

    test.deepEqual(calculateFunctionHash(fn1), 'ebf2e871fc6a3062e8bdcc5ebe16db3f');
    test.deepEqual(calculateFunctionHash(fn2), 'ffedf6424a18a594a513129dc97bf53c');
    test.done();
  },

  'impact of env variables order on hash': {

    'without "currentVersion", we preserve old behavior to avoid unnesesary invalidation of templates'(test: Test) {
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

      test.notDeepEqual(calculateFunctionHash(fn1), calculateFunctionHash(fn2));
      test.done();
    },

    'with "currentVersion", we sort env keys so order is consistent'(test: Test) {
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

      test.deepEqual(calculateFunctionHash(fn1), calculateFunctionHash(fn2));
      test.done();
    },

  },
};
