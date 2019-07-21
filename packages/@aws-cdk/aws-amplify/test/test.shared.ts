import { Construct, IPostProcessor, IResolveContext, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { BasicAuthResolver, EnvironmentVariablesResolver } from '../lib';

export = {
  'Test Basic Auth Resolver: Empty'(test: Test) {
    const stack = new Stack();
    const context: IResolveContext = {
      scope: new Construct(stack, 'stack'),

      registerPostProcessor(_pp: IPostProcessor) {
        return;
      },

      resolve(): any {
        return undefined;
      }
    };

    const bar = new BasicAuthResolver();

    test.equals(bar.resolve(context), undefined, 'No auth set');
    test.done();
  },

  'Test Basic Auth Resolver: Value'(test: Test) {
    const stack = new Stack();
    const context: IResolveContext = {
      scope: new Construct(stack, 'stack'),

      registerPostProcessor(_pp: IPostProcessor) {
        return;
      },

      resolve(): any {
        return undefined;
      }
    };

    const bac = {
      username: 'foo',
      password: 'foo'
    };

    const bar = new BasicAuthResolver();
    bar.basicAuthConfig(bac);

    test.equals(bar.resolve(context), bac, 'Auth set');
    test.done();
  },

  'Test Env Var Resolver: Empty'(test: Test) {
    const evr = new EnvironmentVariablesResolver();

    test.equals(evr.isEmpty(), true, 'No values stored');
    test.equals(evr.count(), 0, 'Empty');
    test.done();
  },

  'Test Env Var Resolver: Values'(test: Test) {
    const evr = new EnvironmentVariablesResolver();
    evr.addEnvironmentVariable('foo', 'bar');

    test.equals(evr.count(), 1, 'Has value');
    test.done();
  },

  'Test Env Var Resolver: Multi Values'(test: Test) {
    const evr = new EnvironmentVariablesResolver();

    const first = {
      name: 'foo',
      value: 'foo'
    };

    const second = {
      name: 'bar',
      value: 'bar'
    };

    evr.addEnvironmentVariables(first, second);

    test.equals(evr.count(), 2, 'Has values');
    test.done();
  },

  'Test Env Var Resolver: Multi Values Resolve'(test: Test) {
    const stack = new Stack();
    const context: IResolveContext = {
      scope: new Construct(stack, 'stack'),

      registerPostProcessor(_pp: IPostProcessor) {
        return;
      },

      resolve(): any {
        return undefined;
      }
    };

    const evr = new EnvironmentVariablesResolver();

    const testValues = [
      {
        name: 'foo',
        value: 'foo'
      },
      {
        name: 'bar',
        value: 'bar'
      }
    ];

    evr.addEnvironmentVariables(...testValues);

    const values = evr.resolve(context);

    test.equals(evr.count(), 2, 'Has values');
    test.deepEqual(values, testValues, 'Resolve');
    test.done();
  },
};