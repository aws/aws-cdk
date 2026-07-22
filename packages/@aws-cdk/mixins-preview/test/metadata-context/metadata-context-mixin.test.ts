import { Template } from 'aws-cdk-lib/assertions';
import { App, CfnResource, ContextMutability, MetadataContext, Mixins, Stack } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { MetadataContextMixin } from '../../lib/metadata-context-mixin';

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

    Template.fromStack(stack).hasResource('AWS::SQS::Queue', {
      Metadata: {
        Context: {
          why: 'buffers webhook events',
          must: ['VisTimeout >= 6x fn timeout'],
          mutable: 'change-with-constraints',
        },
      },
    });
  });

  test('supports() rejects non-CfnResource constructs and applyTo no-ops', () => {
    const plain = new Construct(stack, 'Plain');
    const mixin = new MetadataContextMixin({ why: 'x' });

    expect(mixin.supports(plain)).toBe(false);
    expect(() => plain.with(mixin)).not.toThrow();
    // Direct applyTo() calls (e.g. from third-party applicators) must also no-op
    expect(() => mixin.applyTo(plain)).not.toThrow();
    expect(Object.keys(Template.fromStack(stack).toJSON().Resources ?? {})).toHaveLength(0);
  });

  test('later mixin application wins scalars, unions lists', () => {
    const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

    res.with(new MetadataContextMixin({ why: 'first', must: ['rule 1'] }));
    res.with(new MetadataContextMixin({ why: 'second', must: ['rule 2'] }));

    Template.fromStack(stack).hasResource('AWS::Fake::Thing', {
      Metadata: {
        Context: {
          why: 'second',
          must: ['rule 1', 'rule 2'],
        },
      },
    });
  });

  test('mixin-applied context wins over context cascaded from enclosing scopes', () => {
    const scope = new Construct(stack, 'SubSystem');
    const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

    MetadataContext.of(scope).add({ why: 'cascaded rationale', must: ['cascaded rule'] });
    res.with(new MetadataContextMixin({ why: 'mixin rationale', must: ['mixin rule'] }));

    Template.fromStack(stack).hasResource('AWS::Fake::Thing', {
      Metadata: {
        Context: {
          why: 'mixin rationale',
          must: ['cascaded rule', 'mixin rule'],
        },
      },
    });
  });

  test('bulk application via Mixins.of() targets all CfnResources in scope', () => {
    const scope = new Construct(stack, 'SubSystem');
    new CfnResource(scope, 'Queue', { type: 'AWS::SQS::Queue' });
    new CfnResource(scope, 'Topic', { type: 'AWS::SNS::Topic' });

    Mixins.of(scope).apply(new MetadataContextMixin({ deps: ['NetworkStack'] }));

    const template = Template.fromStack(stack);
    template.hasResource('AWS::SQS::Queue', {
      Metadata: { Context: { deps: ['NetworkStack'] } },
    });
    template.hasResource('AWS::SNS::Topic', {
      Metadata: { Context: { deps: ['NetworkStack'] } },
    });
  });

  test('empty context is rejected when the mixin is applied', () => {
    const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
    expect(() => res.with(new MetadataContextMixin({}))).toThrow(/at least one context field/);
  });
});
