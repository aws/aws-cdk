import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as path from 'path';
import * as lambda from '../lib';
import { calculateFunctionHash, trimFromStart } from '../lib/function-hash';

export = {
  "trimFromStart": {

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
    }

  },

  "calcHash": {
    'same configuration and code yields the same hash'(test: Test) {
      const stack1 = new Stack();
      const fn1 = new lambda.Function(stack1, 'MyFunction1', {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler'
      });

      const stack2 = new Stack();
      const fn2 = new lambda.Function(stack2, 'MyFunction1', {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler'
      });

      test.deepEqual(calculateFunctionHash(fn1), 'a1dd0e860a511e65bf720e3bd0f6b6a9');
      test.deepEqual(calculateFunctionHash(fn2), 'a1dd0e860a511e65bf720e3bd0f6b6a9');
      test.done();
    },
  },

  'code impacts hash'(test: Test) {
    const stack1 = new Stack();
    const fn1 = new lambda.Function(stack1, 'MyFunction1', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler'
    });

    test.notDeepEqual(calculateFunctionHash(fn1), 'a1dd0e860a511e65bf720e3bd0f6b6a9');
    test.deepEqual(calculateFunctionHash(fn1), '1ad32fcab0aa68bf36825df8e6f0a7a2');
    test.done();
  },

  'environment variables impact hash'(test: Test) {
    const stack1 = new Stack();
    const fn1 = new lambda.Function(stack1, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      environment: {
        Foo: 'bar'
      }
    });

    const stack2 = new Stack();
    const fn2 = new lambda.Function(stack2, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      environment: {
        Foo: 'beer'
      }
    });

    test.deepEqual(calculateFunctionHash(fn1), 'ea4daca738e83756eec5a3a3c806d54d');
    test.deepEqual(calculateFunctionHash(fn2), '2cb1ed852c739c60254b3bbfb258e513');
    test.done();
  },

  'runtime impacts hash'(test: Test) {
    const stack1 = new Stack();
    const fn1 = new lambda.Function(stack1, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      environment: {
        Foo: 'bar'
      }
    });

    const stack2 = new Stack();
    const fn2 = new lambda.Function(stack2, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      environment: {
        Foo: 'beer'
      }
    });

    test.deepEqual(calculateFunctionHash(fn1), 'ea4daca738e83756eec5a3a3c806d54d');
    test.deepEqual(calculateFunctionHash(fn2), '4bdbec98b3c838410b5637fb71101514');
    test.done();
  }
};
