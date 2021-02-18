import { CloudAssembly } from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { App, Stack } from '../lib';
import { Annotations } from '../lib/annotations';

const restore = process.env.CDK_BLOCK_DEPRECATIONS;

nodeunitShim({
  'tearDown'(cb: any) {
    process.env.CDK_BLOCK_DEPRECATIONS = restore; // restore to the original value
    cb();
  },

  'addDeprecation() annotates the usage of a deprecated API'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const c1 = new Construct(stack, 'Hello');

    // WHEN
    delete process.env.CDK_BLOCK_DEPRECATIONS;
    Annotations.of(c1).addDeprecation('@aws-cdk/core.Construct.node', 'use @aws-Construct.construct instead');

    // THEN
    test.deepEqual(getWarnings(app.synth()), [
      {
        path: '/MyStack/Hello',
        message: 'The API @aws-cdk/core.Construct.node is deprecated: use @aws-Construct.construct instead. This API will be removed in the next major release',
      },
    ]);
    test.done();
  },

  'deduplicated per node based on "api"'(test: Test) {
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
    test.deepEqual(getWarnings(app.synth()), [
      {
        path: '/MyStack1/Hello',
        message: 'The API @aws-cdk/core.Construct.node is deprecated: use @aws-Construct.construct instead. This API will be removed in the next major release',
      },
      {
        path: '/MyStack1/World',
        message: 'The API @aws-cdk/core.Construct.node is deprecated: use @aws-Construct.construct instead. This API will be removed in the next major release',
      },
      {
        path: '/MyStack2/FooBar',
        message: 'The API @aws-cdk/core.Construct.node is deprecated: use @aws-Construct.construct instead. This API will be removed in the next major release',
      },
    ]);
    test.done();
  },

  'CDK_BLOCK_DEPRECATIONS will throw if a deprecated API is used'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const c1 = new Construct(stack, 'Hello');

    // THEN
    process.env.CDK_BLOCK_DEPRECATIONS = '1';
    test.throws(() => Annotations.of(c1).addDeprecation('foo', 'bar'), /MyStack\/Hello: The API foo is deprecated: bar\. This API will be removed in the next major release/);
    test.done();
  },
});

function getWarnings(casm: CloudAssembly) {
  const result = new Array<{ path: string, message: string }>();
  for (const stack of Object.values(casm.manifest.artifacts ?? {})) {
    for (const [path, md] of Object.entries(stack.metadata ?? {})) {
      for (const x of md) {
        if (x.type === 'aws:cdk:warning') {
          result.push({ path, message: x.data as string });
        }
      }
    }
  }
  return result;
}
