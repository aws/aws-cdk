import { Construct } from 'constructs';
import { App, CfnResource, ContextMutability, MetadataContext, MetadataContextMixin, Mixins, Stack } from '../../lib';
import { toCloudFormation } from '../util';

describe('MetadataContextMixin', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  test('with() renders a Metadata.Context block on a CfnResource', () => {
    const res = new CfnResource(stack, 'Queue', { type: 'AWS::SQS::Queue' });

    res.with(new MetadataContextMixin({
      why: 'buffers webhook events',
      must: ['VisTimeout >= 6x fn timeout'],
      mutable: ContextMutability.CHANGE_WITH_CONSTRAINTS,
    }));

    const template = toCloudFormation(stack);
    expect(template.Resources.Queue.Metadata.Context).toEqual({
      why: 'buffers webhook events',
      must: ['VisTimeout >= 6x fn timeout'],
      mutable: 'change-with-constraints',
    });
  });

  test('supports() rejects non-CfnResource constructs and applyTo no-ops', () => {
    const plain = new Construct(stack, 'Plain');
    const mixin = new MetadataContextMixin({ why: 'x' });

    expect(mixin.supports(plain)).toBe(false);
    expect(() => plain.with(mixin)).not.toThrow();
    // Direct applyTo() calls (e.g. from third-party applicators) must also no-op
    expect(() => mixin.applyTo(plain)).not.toThrow();
    expect(Object.keys(toCloudFormation(stack).Resources ?? {})).toHaveLength(0);
  });

  test('later mixin application wins scalars, unions lists', () => {
    const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

    res.with(new MetadataContextMixin({ why: 'first', must: ['rule 1'] }));
    res.with(new MetadataContextMixin({ why: 'second', must: ['rule 2'] }));

    const template = toCloudFormation(stack);
    expect(template.Resources.Res.Metadata.Context).toEqual({
      why: 'second',
      must: ['rule 1', 'rule 2'],
    });
  });

  test('mixin-applied context wins over context cascaded from enclosing scopes', () => {
    const scope = new Construct(stack, 'SubSystem');
    const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

    MetadataContext.of(scope).add({ why: 'cascaded rationale', must: ['cascaded rule'] });
    res.with(new MetadataContextMixin({ why: 'mixin rationale', must: ['mixin rule'] }));

    const resources = Object.values<any>(toCloudFormation(stack).Resources);
    expect(resources).toHaveLength(1);
    expect(resources[0].Metadata.Context).toEqual({
      why: 'mixin rationale',
      must: ['cascaded rule', 'mixin rule'],
    });
  });

  test('bulk application via Mixins.of() targets all CfnResources in scope', () => {
    const scope = new Construct(stack, 'SubSystem');
    new CfnResource(scope, 'Queue', { type: 'AWS::SQS::Queue' });
    new CfnResource(scope, 'Topic', { type: 'AWS::SNS::Topic' });

    Mixins.of(scope).apply(new MetadataContextMixin({ deps: ['NetworkStack'] }));

    const resources = Object.values<any>(toCloudFormation(stack).Resources);
    expect(resources).toHaveLength(2);
    for (const resource of resources) {
      expect(resource.Metadata.Context).toEqual({ deps: ['NetworkStack'] });
    }
  });

  test('fails when the applied context is empty', () => {
    const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
    expect(() => res.with(new MetadataContextMixin({}))).toThrow(/at least one context field/);
  });
});
