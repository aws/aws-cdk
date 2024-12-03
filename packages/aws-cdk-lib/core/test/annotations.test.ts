import { Construct } from 'constructs';
import { getWarnings } from './util';
import { App, Stack } from '../lib';
import { Annotations } from '../lib/annotations';

const restore = process.env.CDK_BLOCK_DEPRECATIONS;

describe('annotations', () => {
  afterEach(() => {
    process.env.CDK_BLOCK_DEPRECATIONS = restore; // restore to the original value
  });

  test('addDeprecation() annotates the usage of a deprecated API', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const c1 = new Construct(stack, 'Hello');

    // WHEN
    delete process.env.CDK_BLOCK_DEPRECATIONS;
    Annotations.of(c1).addDeprecation('@aws-cdk/core.Construct.node', 'use @aws-Construct.construct instead');

    // THEN
    expect(getWarnings(app.synth())).toEqual([
      {
        path: '/MyStack/Hello',
        message: 'The API @aws-cdk/core.Construct.node is deprecated: use @aws-Construct.construct instead. This API will be removed in the next major release [ack: Deprecated:@aws-cdk/core.Construct.node]',
      },
    ]);
  });

  test('deduplicated per node based on "api"', () => {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'MyStack1');
    const stack2 = new Stack(app, 'MyStack2');
    const c1 = new Construct(stack1, 'Hello');
    const c2 = new Construct(stack1, 'World');
    const c3 = new Construct(stack2, 'FooBar');

    // WHEN
    delete process.env.CDK_BLOCK_DEPRECATIONS;
    Annotations.of(c1).addDeprecation('@aws-cdk/core.Construct.node', 'use @aws-Construct.construct instead');
    Annotations.of(c2).addDeprecation('@aws-cdk/core.Construct.node', 'use @aws-Construct.construct instead');
    Annotations.of(c1).addDeprecation('@aws-cdk/core.Construct.node', 'use @aws-Construct.construct instead');
    Annotations.of(c3).addDeprecation('@aws-cdk/core.Construct.node', 'use @aws-Construct.construct instead');
    Annotations.of(c1).addDeprecation('@aws-cdk/core.Construct.node', 'use @aws-Construct.construct instead');
    Annotations.of(c1).addDeprecation('@aws-cdk/core.Construct.node', 'use @aws-Construct.construct instead');

    // THEN
    expect(getWarnings(app.synth())).toEqual([
      {
        path: '/MyStack1/Hello',
        message: 'The API @aws-cdk/core.Construct.node is deprecated: use @aws-Construct.construct instead. This API will be removed in the next major release [ack: Deprecated:@aws-cdk/core.Construct.node]',
      },
      {
        path: '/MyStack1/World',
        message: 'The API @aws-cdk/core.Construct.node is deprecated: use @aws-Construct.construct instead. This API will be removed in the next major release [ack: Deprecated:@aws-cdk/core.Construct.node]',
      },
      {
        path: '/MyStack2/FooBar',
        message: 'The API @aws-cdk/core.Construct.node is deprecated: use @aws-Construct.construct instead. This API will be removed in the next major release [ack: Deprecated:@aws-cdk/core.Construct.node]',
      },
    ]);
  });

  test('CDK_BLOCK_DEPRECATIONS will throw if a deprecated API is used', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const c1 = new Construct(stack, 'Hello');

    // THEN
    process.env.CDK_BLOCK_DEPRECATIONS = '1';
    expect(() => Annotations.of(c1).addDeprecation('foo', 'bar')).toThrow(/MyStack\/Hello: The API foo is deprecated: bar\. This API will be removed in the next major release/);
  });

  test('addMessage deduplicates the message on the node level', () => {
    const app = new App();
    const stack = new Stack(app, 'S1');
    const c1 = new Construct(stack, 'C1');
    Annotations.of(c1).addWarningV2('warning1', 'You should know this!');
    Annotations.of(c1).addWarningV2('warning1', 'You should know this!');
    Annotations.of(c1).addWarningV2('warning1', 'You should know this!');
    Annotations.of(c1).addWarningV2('warning2', 'You should know this, too!');
    expect(getWarnings(app.synth())).toEqual([
      {
        path: '/S1/C1',
        message: 'You should know this! [ack: warning1]',
      },
      {
        path: '/S1/C1',
        message: 'You should know this, too! [ack: warning2]',
      },
    ]);
  });

  test('acknowledgeWarning removes warning', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'S1');
    const c1 = new Construct(stack, 'C1');

    // WHEN
    Annotations.of(c1).addWarningV2('MESSAGE1', 'You should know this!');
    Annotations.of(c1).addWarningV2('MESSAGE2', 'You Should know this too!');
    Annotations.of(c1).acknowledgeWarning('MESSAGE2', 'I Ack this');

    // THEN
    expect(getWarnings(app.synth())).toEqual([
      {
        path: '/S1/C1',
        message: 'You should know this! [ack: MESSAGE1]',
      },
    ]);
  });

  test('acknowledgeWarning removes warning on children', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'S1');
    const c1 = new Construct(stack, 'C1');
    const c2 = new Construct(c1, 'C2');

    // WHEN
    Annotations.of(c2).addWarningV2('MESSAGE2', 'You Should know this too!');
    Annotations.of(c1).acknowledgeWarning('MESSAGE2', 'I Ack this');

    // THEN
    expect(getWarnings(app.synth())).toEqual([]);
  });
});
