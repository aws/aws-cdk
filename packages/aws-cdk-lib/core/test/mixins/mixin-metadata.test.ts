import { Construct } from 'constructs';
import { App, Stack } from '../../lib';
import { Mixin, Mixins } from '../../lib/mixins';

const JSII_RUNTIME_SYMBOL = Symbol.for('jsii.rtti');
const MIXIN_METADATA_KEY = 'aws:cdk:analytics:mixin';

class TestMixin extends Mixin {
  static readonly [JSII_RUNTIME_SYMBOL] = { fqn: '@aws-cdk/mixins-preview.TestMixin' };
  applyTo(construct: any): any {
    return construct;
  }
}

class MixinWithoutFqn extends Mixin {
  applyTo(construct: any): any {
    return construct;
  }
}

class ThirdPartyMixin extends Mixin {
  static readonly [JSII_RUNTIME_SYMBOL] = { fqn: 'some-third-party.ThirdPartyMixin' };
  applyTo(construct: any): any {
    return construct;
  }
}

describe('Mixin Metadata', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  test('adds metadata when mixin has jsii fqn', () => {
    const construct = new Construct(stack, 'Test');
    Mixins.of(construct).apply(new TestMixin());

    const metadata = construct.node.metadata.find(m => m.type === MIXIN_METADATA_KEY);
    expect(metadata).toBeDefined();
    expect(metadata?.data).toEqual({ mixin: '@aws-cdk/mixins-preview.TestMixin' });
  });

  test('adds metadata for each applied mixin', () => {
    const construct = new Construct(stack, 'Test');
    Mixins.of(construct).apply(new TestMixin(), new TestMixin());

    const metadata = construct.node.metadata.filter(m => m.type === MIXIN_METADATA_KEY);
    expect(metadata.length).toBe(2);
  });

  test('redacts fqn for non-allowed prefixes', () => {
    const construct = new Construct(stack, 'Test');
    Mixins.of(construct).apply(new ThirdPartyMixin());

    const metadata = construct.node.metadata.find(m => m.type === MIXIN_METADATA_KEY);
    expect(metadata).toBeDefined();
    expect(metadata?.data).toEqual({ mixin: '*' });
  });

  test('tracks redacted mixins when mixin has no jsii fqn', () => {
    const construct = new Construct(stack, 'Test');
    Mixins.of(construct).apply(new MixinWithoutFqn());

    const metadata = construct.node.metadata.find(m => m.type === MIXIN_METADATA_KEY);
    expect(metadata).toBeDefined();
    expect(metadata?.data).toEqual({ mixin: '*' });
  });
});
