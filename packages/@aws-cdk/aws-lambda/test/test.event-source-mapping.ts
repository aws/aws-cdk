import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Code, EventSourceMapping, Function, Runtime } from '../lib';

export = {
  'throws if maxBatchingWindow > 300 seconds'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new Function(stack, 'fn', {
      handler: 'index.handler',
      code: Code.fromInline('exports.handler = ${handler.toString()}'),
      runtime: Runtime.NODEJS_10_X,
    });

    test.throws(() =>
      new EventSourceMapping(
        stack,
        'test',
        {
          target: fn,
          eventSourceArn: '',
          maxBatchingWindow: cdk.Duration.seconds(301),
        }), /maxBatchingWindow cannot be over 300 seconds/);

    test.done();
  },
  'throws if maxRecordAge is below 60 seconds'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new Function(stack, 'fn', {
      handler: 'index.handler',
      code: Code.fromInline('exports.handler = ${handler.toString()}'),
      runtime: Runtime.NODEJS_10_X,
    });

    test.throws(() =>
      new EventSourceMapping(
        stack,
        'test',
        {
          target: fn,
          eventSourceArn: '',
          maxRecordAge: cdk.Duration.seconds(59),
        }), /maxRecordAge must be between 60 seconds and 7 days inclusive/);

    test.done();
  },
  'throws if maxRecordAge is over 7 days'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new Function(stack, 'fn', {
      handler: 'index.handler',
      code: Code.fromInline('exports.handler = ${handler.toString()}'),
      runtime: Runtime.NODEJS_10_X,
    });

    test.throws(() =>
      new EventSourceMapping(
        stack,
        'test',
        {
          target: fn,
          eventSourceArn: '',
          maxRecordAge: cdk.Duration.seconds(604801),
        }), /maxRecordAge must be between 60 seconds and 7 days inclusive/);

    test.done();
  },
  'throws if retryAttempts is negative'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new Function(stack, 'fn', {
      handler: 'index.handler',
      code: Code.fromInline('exports.handler = ${handler.toString()}'),
      runtime: Runtime.NODEJS_10_X,
    });

    test.throws(() =>
      new EventSourceMapping(
        stack,
        'test',
        {
          target: fn,
          eventSourceArn: '',
          retryAttempts: -1,
        }), /retryAttempts must be between 0 and 10000 inclusive, got -1/);

    test.done();
  },
  'throws if retryAttempts is over 10000'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new Function(stack, 'fn', {
      handler: 'index.handler',
      code: Code.fromInline('exports.handler = ${handler.toString()}'),
      runtime: Runtime.NODEJS_10_X,
    });

    test.throws(() =>
      new EventSourceMapping(
        stack,
        'test',
        {
          target: fn,
          eventSourceArn: '',
          retryAttempts: 10001,
        }), /retryAttempts must be between 0 and 10000 inclusive, got 10001/);

    test.done();
  },
  'accepts if retryAttempts is a token'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new Function(stack, 'fn', {
      handler: 'index.handler',
      code: Code.fromInline('exports.handler = ${handler.toString()}'),
      runtime: Runtime.NODEJS_10_X,
    });

    new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      retryAttempts: cdk.Lazy.numberValue({ produce: () => 100 }),
    });

    test.done();
  },
  'throws if parallelizationFactor is below 1'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new Function(stack, 'fn', {
      handler: 'index.handler',
      code: Code.fromInline('exports.handler = ${handler.toString()}'),
      runtime: Runtime.NODEJS_10_X,
    });

    test.throws(() =>
      new EventSourceMapping(
        stack,
        'test',
        {
          target: fn,
          eventSourceArn: '',
          parallelizationFactor: 0,
        }), /parallelizationFactor must be between 1 and 10 inclusive, got 0/);

    test.done();
  },
  'throws if parallelizationFactor is over 10'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new Function(stack, 'fn', {
      handler: 'index.handler',
      code: Code.fromInline('exports.handler = ${handler.toString()}'),
      runtime: Runtime.NODEJS_10_X,
    });

    test.throws(() =>
      new EventSourceMapping(
        stack,
        'test',
        {
          target: fn,
          eventSourceArn: '',
          parallelizationFactor: 11,
        }), /parallelizationFactor must be between 1 and 10 inclusive, got 11/);

    test.done();
  },

  'accepts if parallelizationFactor is a token'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new Function(stack, 'fn', {
      handler: 'index.handler',
      code: Code.fromInline('exports.handler = ${handler.toString()}'),
      runtime: Runtime.NODEJS_10_X,
    });

    new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      parallelizationFactor: cdk.Lazy.numberValue({ produce: () => 20 }),
    });

    test.done();
  },

  'import event source mapping'(test: Test) {
    const stack = new cdk.Stack(undefined, undefined, { stackName: 'test-stack' });
    const imported = EventSourceMapping.fromEventSourceMappingId(stack, 'imported', '14e0db71-5d35-4eb5-b481-8945cf9d10c2');

    test.equals(imported.eventSourceMappingId, '14e0db71-5d35-4eb5-b481-8945cf9d10c2');
    test.equals(imported.stack.stackName, 'test-stack');
    test.done();
  },
};
