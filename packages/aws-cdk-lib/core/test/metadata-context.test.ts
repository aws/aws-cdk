import * as fs from 'fs';
import * as path from 'path';
import type { IConstruct } from 'constructs';
import { Construct } from 'constructs';
import type { CfnTemplateContextProps, IAspect, IConstructSelector } from '../lib';
import {
  App,
  AspectPriority,
  Aspects,
  CfnResource,
  CfnContextMutability,
  CfnContextTrustConfidence,
  CfnContextTrustSource,
  ConstructSelector,
  Lazy,
  NestedStack,
  CfnResourceMetadataContext,
  Stack,
  Stage,
  CfnTemplateMetadataContext,
  ValidationError,
} from '../lib';
import { toCloudFormation } from './util';
import { synthesize } from '../lib/private/synthesis';

const CONTEXT_METADATA_KEY = 'com.aws.cloudformation.Context';
const NO_RESOURCE_SELECTED = /metadata context set\(\) or clear\(\) selected no CfnResource/;

describe('metadata context', () => {
  describe('resource-level context', () => {
    test('renders a namespaced Context metadata block on a CfnResource', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Queue', { type: 'AWS::SQS::Queue' });

      CfnResourceMetadataContext.of(res).set({
        why: 'buffer order events async; 14d retention = compliance window',
        must: ['VisTimeout >= 6x fn timeout, else dup on retry'],
        mutable: CfnContextMutability.CHANGE_WITH_CONSTRAINTS,
        mutability: { QueueName: CfnContextMutability.MUST_NEVER_CHANGE },
        deps: ['NetworkStack'],
      });

      const template = toCloudFormation(stack);
      expect(template.Resources.Queue.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'buffer order events async; 14d retention = compliance window',
        must: ['VisTimeout >= 6x fn timeout, else dup on retry'],
        mutable: 'change-with-constraints',
        mutability: { QueueName: 'must-never-change' },
        deps: ['NetworkStack'],
      });
    });

    test('API property names are written to the template unchanged (1:1 with the schema)', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({
        why: 'resource name is referenced by an external consumer',
        must: ['Name must not change because replacement loses the external reference'],
        mutable: CfnContextMutability.FREE_TO_TUNE,
        mutability: { Name: CfnContextMutability.MUST_NEVER_CHANGE },
        trust: { src: CfnContextTrustSource.AUTHORED, conf: CfnContextTrustConfidence.HIGH, cite: 'docs/naming.md' },
        deps: ['ConsumerStack'],
      });

      const context = toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY];
      expect(Object.keys(context).sort()).toEqual(['deps', 'must', 'mutability', 'mutable', 'trust', 'why']);
      expect(Object.keys(context.trust).sort()).toEqual(['cite', 'conf', 'src']);
      expect(context.mutable).toEqual('free-to-tune');
      expect(context.mutability).toEqual({ Name: 'must-never-change' });
    });

    test('emits no trust block when trust is not supplied', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({ why: 'no trust recorded here', must: ['a rule'] });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'no trust recorded here',
        must: ['a rule'],
      });
    });

    test('renders explicit trust with the schema field names src/conf/cite/note', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({
        why: 'absorb transient processor failures without dropping orders',
        trust: {
          src: CfnContextTrustSource.INFER,
          conf: CfnContextTrustConfidence.LOW,
          cite: 'api/handler.ts:87',
          note: 'rationale inferred from retry wrapper; no explicit design doc found',
        },
      });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY].trust).toEqual({
        src: 'infer',
        conf: 'low',
        cite: 'api/handler.ts:87',
        note: 'rationale inferred from retry wrapper; no explicit design doc found',
      });
    });

    test('list values are written as given, without de-duplication', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({ must: ['same rule', 'same rule'], deps: ['NetworkStack', 'NetworkStack'] });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        must: ['same rule', 'same rule'],
        deps: ['NetworkStack', 'NetworkStack'],
      });
    });

    test('resolves lazy resource list values without inspecting their token encoding', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({
        must: Lazy.list({ produce: () => ['resolved rule'] }),
        deps: Lazy.list({ produce: () => ['ResolvedStack'] }),
      });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        must: ['resolved rule'],
        deps: ['ResolvedStack'],
      });
    });
  });

  describe('resource-level targeting', () => {
    test('the default selector targets the scope when it is a CfnResource', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({ why: 'on the resource itself' });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({ why: 'on the resource itself' });
    });

    test('the default selector targets an immediate CfnResource defaultChild and skips helper resources', () => {
      const stack = new Stack();
      const l2 = new Construct(stack, 'MyQueue');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::SQS::Queue' });
      const helper = new CfnResource(l2, 'HelperRole', { type: 'AWS::IAM::Role' });

      CfnResourceMetadataContext.of(l2).set({ why: 'buffers events' });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(primary)].Metadata[CONTEXT_METADATA_KEY]).toEqual({ why: 'buffers events' });
      expect(template.Resources[stack.getLogicalId(helper)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('fails when the defaultChild is a construct, because the default selector does not follow a defaultChild chain', () => {
      const stack = new Stack();
      const l3 = new Construct(stack, 'EdgeFunction');
      const l2 = new Construct(l3, 'Fn');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::Lambda::Function' });
      l3.node.defaultChild = l2;

      CfnResourceMetadataContext.of(l3).set({ why: 'runs at the edge' });

      expect(() => synthesize(stack)).toThrow(NO_RESOURCE_SELECTED);
      expect(primary.getMetadata(CONTEXT_METADATA_KEY)).toBeUndefined();
    });

    test('fails for an L3 that declares no defaultChild even when its children do', () => {
      const stack = new Stack();
      const l3 = new Construct(stack, 'Service');
      new CfnResource(new Construct(l3, 'LB'), 'Resource', { type: 'AWS::ElasticLoadBalancingV2::LoadBalancer' });
      new CfnResource(new Construct(l3, 'Svc'), 'Resource', { type: 'AWS::ECS::Service' });

      CfnResourceMetadataContext.of(l3).set({ why: 'no primary resource' });

      expect(() => synthesize(stack)).toThrow(NO_RESOURCE_SELECTED);
    });

    test('fails for a grouping construct with no CfnResource defaultChild', () => {
      const stack = new Stack();
      const group = new Construct(stack, 'SubSystem');
      new CfnResource(group, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(group).set({ why: 'grouping rationale' });

      expect(() => synthesize(stack)).toThrow(NO_RESOURCE_SELECTED);
    });

    test('fails from a Stack scope with the default selector', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(stack).set({ why: 'stack-wide but narrow by default' });

      expect(() => synthesize(stack)).toThrow(NO_RESOURCE_SELECTED);
    });

    test('an L3 without a defaultChild can be targeted with a resource-type selector', () => {
      const stack = new Stack();
      const l3 = new Construct(stack, 'Service');
      const lbL2 = new Construct(l3, 'LB');
      const lb = new CfnResource(lbL2, 'Resource', { type: 'AWS::ElasticLoadBalancingV2::LoadBalancer' });
      const lbHelper = new CfnResource(lbL2, 'SecurityGroup', { type: 'AWS::EC2::SecurityGroup' });
      const svc = new CfnResource(new Construct(l3, 'Svc'), 'Resource', { type: 'AWS::ECS::Service' });

      CfnResourceMetadataContext.of(l3).set({
        must: ['ALB idle timeout >= backend read timeout'],
      }, {
        selector: ConstructSelector.resourcesOfType('AWS::ElasticLoadBalancingV2::LoadBalancer'),
      });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(lb)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        must: ['ALB idle timeout >= backend read timeout'],
      });
      expect(template.Resources[stack.getLogicalId(lbHelper)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
      expect(template.Resources[stack.getLogicalId(svc)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('ConstructSelector.all() targets every CfnResource beneath the scope, helpers included', () => {
      const stack = new Stack();
      const l2 = new Construct(stack, 'MyQueue');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::SQS::Queue' });
      const helper = new CfnResource(l2, 'Policy', { type: 'AWS::SQS::QueuePolicy' });
      const loose = new CfnResource(stack, 'Loose', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(stack).set({ deps: ['NetworkStack'] }, { selector: ConstructSelector.all() });

      const template = toCloudFormation(stack);
      for (const resource of [primary, helper, loose]) {
        expect(template.Resources[stack.getLogicalId(resource)].Metadata[CONTEXT_METADATA_KEY]).toEqual({ deps: ['NetworkStack'] });
      }
    });

    test('a selector that omits the primary resource type targets only the helper resources of an L2', () => {
      const stack = new Stack();
      const l2 = new Construct(stack, 'Fn');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::Lambda::Function' });
      const role = new CfnResource(l2, 'ServiceRole', { type: 'AWS::IAM::Role' });
      const policy = new CfnResource(l2, 'ServiceRolePolicy', { type: 'AWS::IAM::Policy' });

      CfnResourceMetadataContext.of(l2).set({
        why: 'supporting resource for the order processor',
      }, {
        selector: ConstructSelector.resourcesOfType('AWS::IAM::Role', 'AWS::IAM::Policy'),
      });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(primary)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
      for (const helper of [role, policy]) {
        expect(template.Resources[stack.getLogicalId(helper)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
          why: 'supporting resource for the order processor',
        });
      }
    });

    test('selected constructs that are not CfnResources are ignored', () => {
      const stack = new Stack();
      const fn = new Construct(stack, 'Fn');
      const role = new Construct(fn, 'ServiceRole');
      const cfnRole = new CfnResource(role, 'Resource', { type: 'AWS::IAM::Role' });
      const cfnServiceRole = new CfnResource(stack, 'ServiceRole', { type: 'AWS::IAM::Role' });

      CfnResourceMetadataContext.of(stack).set(
        { must: ['execution roles must keep the organization permissions boundary'] },
        { selector: ConstructSelector.byId('ServiceRole') },
      );

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(cfnRole)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
      expect(template.Resources[stack.getLogicalId(cfnServiceRole)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        must: ['execution roles must keep the organization permissions boundary'],
      });
    });

    test('ConstructSelector.onlyItself() fails on a construct that is not a CfnResource', () => {
      const stack = new Stack();
      const l2 = new Construct(stack, 'MyQueue');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::SQS::Queue' });

      CfnResourceMetadataContext.of(l2).set({ why: 'buffers events' }, { selector: ConstructSelector.onlyItself() });

      expect(() => synthesize(stack)).toThrow(NO_RESOURCE_SELECTED);
      expect(primary.getMetadata(CONTEXT_METADATA_KEY)).toBeUndefined();
    });

    test('fails when the selector selects only constructs that are not CfnResources', () => {
      const stack = new Stack();
      const group = new Construct(stack, 'Group');
      new CfnResource(group, 'Resource', { type: 'AWS::SQS::Queue' });

      CfnResourceMetadataContext.of(stack).set({ why: 'grouping rationale' }, { selector: ConstructSelector.byId('Group') });

      expect(() => synthesize(stack)).toThrow(NO_RESOURCE_SELECTED);
    });

    test('the selector runs at synthesis, so it covers resources added after set()', () => {
      const stack = new Stack();

      CfnResourceMetadataContext.of(stack).set(
        { must: ['delivery settings must preserve in-flight messages'] },
        { selector: ConstructSelector.resourcesOfType('AWS::SQS::Queue') },
      );
      const queue = new CfnResource(stack, 'Queue', { type: 'AWS::SQS::Queue' });

      expect(toCloudFormation(stack).Resources[stack.getLogicalId(queue)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        must: ['delivery settings must preserve in-flight messages'],
      });
    });

    test.each([
      ['single-pass Aspect traversal', false],
      ['stabilized Aspect traversal', true],
    ])('re-evaluates a custom selector on each synthesis with %s', (_description, aspectStabilization) => {
      class SelectTarget implements IConstructSelector {
        public target?: IConstruct;

        public select(): IConstruct[] {
          return this.target === undefined ? [] : [this.target];
        }
      }

      const stack = new Stack();
      const first = new CfnResource(stack, 'First', { type: 'AWS::Fake::Thing' });
      const second = new CfnResource(stack, 'Second', { type: 'AWS::Fake::Thing' });
      const selector = new SelectTarget();
      selector.target = first;
      CfnResourceMetadataContext.of(stack).set({ why: 'selected resource' }, { selector });

      synthesize(stack, { aspectStabilization });
      expect(first.getMetadata(CONTEXT_METADATA_KEY)).toEqual({ why: 'selected resource' });
      expect(second.getMetadata(CONTEXT_METADATA_KEY)).toBeUndefined();

      selector.target = second;
      synthesize(stack, { aspectStabilization });
      expect(second.getMetadata(CONTEXT_METADATA_KEY)).toEqual({ why: 'selected resource' });
    });

    test.each([
      ['single-pass Aspect traversal', false],
      ['stabilized Aspect traversal', true],
    ])('does not carry a successful selection into a later synthesis with %s', (_description, aspectStabilization) => {
      class ToggleSelector implements IConstructSelector {
        public isEnabled = true;

        public select(scope: IConstruct): IConstruct[] {
          return this.isEnabled ? [scope] : [];
        }
      }

      const stack = new Stack();
      const resource = new CfnResource(stack, 'Resource', { type: 'AWS::Fake::Thing' });
      const selector = new ToggleSelector();
      CfnResourceMetadataContext.of(resource).set({ why: 'selected resource' }, { selector });

      expect(() => synthesize(stack, { aspectStabilization })).not.toThrow();

      selector.isEnabled = false;
      expect(() => synthesize(stack, { aspectStabilization })).toThrow(NO_RESOURCE_SELECTED);
    });

    test.each([
      ['single-pass Aspect traversal', false],
      ['stabilized Aspect traversal', true],
    ])('rescans for a resource created by a lower-priority Aspect with %s', (_description, aspectStabilization) => {
      const stack = new Stack();
      new CfnResource(stack, 'Before', { type: 'AWS::Fake::Before' });
      const trigger = new Construct(stack, 'Trigger');
      let createdResource: CfnResource | undefined;

      Aspects.of(stack).add({
        visit(node: IConstruct): void {
          if (node === trigger && createdResource === undefined) {
            createdResource = new CfnResource(trigger, 'Created', { type: 'AWS::Fake::Created' });
          }
        },
      }, { priority: AspectPriority.MUTATING });
      CfnResourceMetadataContext.of(stack).set(
        { why: 'created during Aspect traversal' },
        {
          selector: ConstructSelector.resourcesOfType('AWS::Fake::Created'),
          priority: AspectPriority.DEFAULT,
        },
      );

      expect(() => synthesize(stack, { aspectStabilization })).not.toThrow();
      expect(createdResource?.getMetadata(CONTEXT_METADATA_KEY)).toEqual({ why: 'created during Aspect traversal' });
    });

    test('accepts a custom IConstructSelector', () => {
      class SelectConstruct implements IConstructSelector {
        constructor(private readonly target: IConstruct) {
        }

        public select(): IConstruct[] {
          return [this.target];
        }
      }
      const stack = new Stack();
      new CfnResource(stack, 'Other', { type: 'AWS::Fake::Thing' });
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(stack).set({ why: 'custom selection' }, { selector: new SelectConstruct(res) });

      const template = toCloudFormation(stack);
      expect(template.Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({ why: 'custom selection' });
      expect(template.Resources.Other.Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('fails when a resource-type selector matches no resources', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      new CfnResource(scope, 'Topic', { type: 'AWS::SNS::Topic' });

      CfnResourceMetadataContext.of(scope).set(
        { why: 'queue-only rationale' },
        { selector: ConstructSelector.resourcesOfType('AWS::SQS::Queue') },
      );

      expect(() => synthesize(stack)).toThrow(NO_RESOURCE_SELECTED);
    });

    test('ConstructSelector.all() fails on an empty scope', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'Empty');

      CfnResourceMetadataContext.of(scope).set({ why: 'no targets' }, { selector: ConstructSelector.all() });

      expect(() => synthesize(stack)).toThrow(NO_RESOURCE_SELECTED);
    });

    test('each set() and clear() call must independently select a CfnResource', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      new CfnResource(scope, 'Queue', { type: 'AWS::SQS::Queue' });

      CfnResourceMetadataContext.of(scope).set(
        { why: 'queue rationale' },
        { selector: ConstructSelector.resourcesOfType('AWS::SQS::Queue') },
      );
      CfnResourceMetadataContext.of(scope).clear({ selector: ConstructSelector.resourcesOfType('AWS::SNS::Topic') });

      expect(() => synthesize(stack)).toThrow(NO_RESOURCE_SELECTED);
    });

    test('an ambiguous defaultChild surfaces the constructs error at synthesis', () => {
      const stack = new Stack();
      const ambiguous = new Construct(stack, 'Ambiguous');
      new CfnResource(ambiguous, 'Resource', { type: 'AWS::Fake::Thing' });
      new CfnResource(ambiguous, 'Default', { type: 'AWS::Fake::Other' });

      CfnResourceMetadataContext.of(ambiguous).set({ why: 'x' });

      expect(() => synthesize(stack)).toThrow(
        /Cannot determine default child for .*Ambiguous.*both a child with id "Resource" and id "Default"/,
      );
    });
  });

  describe('resource-level replacement and ordering', () => {
    test('a set() on a child scope replaces the complete Context set on a parent scope', () => {
      const stack = new Stack();
      const l2 = new Construct(stack, 'WebhookQueue');
      const queue = new CfnResource(l2, 'Resource', { type: 'AWS::SQS::Queue' });
      const otherQueue = new CfnResource(stack, 'OtherQueue', { type: 'AWS::SQS::Queue' });

      CfnResourceMetadataContext.of(stack).set({
        why: 'part of the order-processing subsystem',
        must: ['queues use the security team customer managed AWS KMS key'],
      }, { selector: ConstructSelector.resourcesOfType('AWS::SQS::Queue') });
      CfnResourceMetadataContext.of(l2).set({
        why: 'buffers webhook events for asynchronous processing',
        must: ['VisibilityTimeout must be at least six times the consumer timeout'],
      });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(queue)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'buffers webhook events for asynchronous processing',
        must: ['VisibilityTimeout must be at least six times the consumer timeout'],
      });
      expect(template.Resources[stack.getLogicalId(otherQueue)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'part of the order-processing subsystem',
        must: ['queues use the security team customer managed AWS KMS key'],
      });
    });

    test('a child scope wins at the same priority even when its set() call is registered first', () => {
      const stack = new Stack();
      const l2 = new Construct(stack, 'WebhookQueue');
      const queue = new CfnResource(l2, 'Resource', { type: 'AWS::SQS::Queue' });

      CfnResourceMetadataContext.of(l2).set({ why: 'child rationale' });
      CfnResourceMetadataContext.of(stack).set(
        { why: 'parent rationale' },
        { selector: ConstructSelector.resourcesOfType('AWS::SQS::Queue') },
      );

      expect(toCloudFormation(stack).Resources[stack.getLogicalId(queue)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'child rationale',
      });
    });

    test('repeated set() calls on the same scope apply in call order, and the last call replaces the value', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({ why: 'first rationale', must: ['rule 1'] });
      CfnResourceMetadataContext.of(res).set({ deps: ['NetworkStack'] });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({ deps: ['NetworkStack'] });
    });

    test('a lower priority runs first, so a parent set() with a higher priority replaces a child set()', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(stack).set(
        { why: 'applied last' },
        { selector: ConstructSelector.all(), priority: AspectPriority.DEFAULT },
      );
      CfnResourceMetadataContext.of(res).set({ why: 'applied first' }, { priority: AspectPriority.MUTATING });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({ why: 'applied last' });
    });

    test('clear() removes Context, and a later set() writes it again', () => {
      const stack = new Stack();
      const bucket = new CfnResource(stack, 'Bucket', { type: 'AWS::S3::Bucket' });
      const legacyContext = CfnResourceMetadataContext.of(bucket);

      legacyContext.set({ must: ['buckets use the security team customer managed AWS KMS key'] });
      legacyContext.clear();
      legacyContext.set({ why: 'legacy public assets; approved encryption exception' });

      expect(toCloudFormation(stack).Resources.Bucket.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'legacy public assets; approved encryption exception',
      });
    });

    test('clear() on a child scope removes Context set on a parent scope', () => {
      const stack = new Stack();
      const kept = new CfnResource(stack, 'Orders', { type: 'AWS::SQS::Queue' });
      const legacy = new Construct(stack, 'Legacy');
      const legacyQueue = new CfnResource(legacy, 'Queue', { type: 'AWS::SQS::Queue' });
      const legacyTopic = new CfnResource(legacy, 'Topic', { type: 'AWS::SNS::Topic' });

      CfnResourceMetadataContext.of(stack).set({ deps: ['NetworkStack'] }, { selector: ConstructSelector.all() });
      CfnResourceMetadataContext.of(legacy).clear({ selector: ConstructSelector.all() });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(kept)].Metadata[CONTEXT_METADATA_KEY]).toEqual({ deps: ['NetworkStack'] });
      expect(template.Resources[stack.getLogicalId(legacyQueue)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
      expect(template.Resources[stack.getLogicalId(legacyTopic)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('clear() removes only the Context key and keeps other metadata', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      res.addMetadata('com.example.ToolMetadata', { toolSpecificField: 'tool-specific-value' });
      res.addMetadata(CONTEXT_METADATA_KEY, { why: 'written directly' });

      CfnResourceMetadataContext.of(res).clear();

      expect(toCloudFormation(stack).Resources.Res.Metadata).toEqual({
        'com.example.ToolMetadata': { toolSpecificField: 'tool-specific-value' },
      });
    });

    test('clear() on a resource without Context synthesizes without metadata', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(stack).clear({ selector: ConstructSelector.all() });

      expect(toCloudFormation(stack).Resources.Res.Metadata).toBeUndefined();
    });

    test('a later Aspect that writes the Context key directly replaces a set() value', () => {
      class WriteContext implements IAspect {
        public visit(node: IConstruct): void {
          if (CfnResource.isCfnResource(node)) {
            node.addMetadata(CONTEXT_METADATA_KEY, { why: 'written by a later aspect' });
          }
        }
      }
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({ why: 'declared through the metadata-context API' });
      Aspects.of(stack).add(new WriteContext(), { priority: AspectPriority.DEFAULT });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({ why: 'written by a later aspect' });
    });
  });

  describe('resource-level directly written context', () => {
    test('preserves manually added Context when the API is not used', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      const manualContext = { why: 'manual user value' };

      res.addMetadata(CONTEXT_METADATA_KEY, manualContext);

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual(manualContext);
    });

    test('set() replaces the complete directly written Context', () => {
      const stack = new Stack();
      const queue = new Construct(stack, 'Queue');
      const cfnQueue = new CfnResource(queue, 'Resource', { type: 'AWS::SQS::Queue' });
      cfnQueue.addMetadata(CONTEXT_METADATA_KEY, { why: 'written directly', must: ['written directly'] });

      CfnResourceMetadataContext.of(queue).set({ why: 'declared through the metadata-context API' });

      expect(toCloudFormation(stack).Resources[stack.getLogicalId(cfnQueue)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'declared through the metadata-context API',
      });
    });

    test('set() replaces a directly written value that is not an object', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      res.addMetadata(CONTEXT_METADATA_KEY, 'not a context block');

      CfnResourceMetadataContext.of(res).set({ why: 'declared through the metadata-context API' });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'declared through the metadata-context API',
      });
    });

    test('preserves independently defined tool metadata on a resource', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      res.addMetadata('com.example.ToolMetadata', { toolSpecificField: 'tool-specific-value' });

      CfnResourceMetadataContext.of(res).set({ why: 'routes events to external storage' });

      expect(toCloudFormation(stack).Resources.Res.Metadata).toEqual({
        'com.example.ToolMetadata': { toolSpecificField: 'tool-specific-value' },
        [CONTEXT_METADATA_KEY]: { why: 'routes events to external storage' },
      });
    });

    test('resources that no call selects receive no Context', () => {
      const stack = new Stack();
      const withContext = new CfnResource(stack, 'A', { type: 'AWS::Fake::Thing' });
      new CfnResource(stack, 'B', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(withContext).set({ why: 'has context' });

      const template = toCloudFormation(stack);
      expect(template.Resources.A.Metadata[CONTEXT_METADATA_KEY]).toEqual({ why: 'has context' });
      expect(template.Resources.B.Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });
  });

  describe('resource-level assembly boundaries', () => {
    test('set() inside a NestedStack writes to the nested template', () => {
      const app = new App();
      const parent = new Stack(app, 'ParentStack');
      const nested = new NestedStack(parent, 'Child');
      new CfnResource(nested, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(nested).set({ why: 'nested resource rationale' }, { selector: ConstructSelector.all() });

      expect(readNestedTemplate(app, nested).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({ why: 'nested resource rationale' });
    });

    test('ConstructSelector.all() on the parent stack reaches nested stack resources', () => {
      const app = new App();
      const parent = new Stack(app, 'ParentStack');
      const nested = new NestedStack(parent, 'Child');
      new CfnResource(nested, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(parent).set({ must: ['all data encrypted w/ CMK'] }, { selector: ConstructSelector.all() });

      expect(readNestedTemplate(app, nested).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        must: ['all data encrypted w/ CMK'],
      });
    });

    test('set() inside a Stage targets resources in that assembly', () => {
      const app = new App();
      const stage = new Stage(app, 'Deployment');
      const stack = new Stack(stage, 'Stack');
      new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(stage).set({ why: 'stage resource' }, { selector: ConstructSelector.all() });

      const template = stage.synth().getStackByName(stack.stackName).template;
      expect(template.Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({ why: 'stage resource' });
    });

    test('fails when the only selected resources are beneath a Stage', () => {
      const app = new App();
      const stage = new Stage(app, 'Deployment');
      new CfnResource(new Stack(stage, 'Stack'), 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(app).set({ why: 'outside assembly' }, { selector: ConstructSelector.all() });

      expect(() => app.synth()).toThrow(NO_RESOURCE_SELECTED);
    });

    test('set() above a Stage does not reach resources inside the Stage', () => {
      const app = new App();
      new CfnResource(new Stack(app, 'RootStack'), 'RootRes', { type: 'AWS::Fake::Thing' });
      CfnResourceMetadataContext.of(app).set({ why: 'root assembly resource' }, { selector: ConstructSelector.all() });

      const stage = new Stage(app, 'Deployment');
      const stack = new Stack(stage, 'StageStack');
      new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      const template = stage.synth().getStackByName(stack.stackName).template;
      expect(template.Resources.Res.Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });
  });

  describe('resource-level validation', () => {
    test('set() never throws; invalid values and empty selections fail synthesis', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Queue', { type: 'AWS::SQS::Queue' });

      expect(() => CfnResourceMetadataContext.of(res).set({
        why: 'x',
        trust: { conf: CfnContextTrustConfidence.HIGH } as any,
      })).not.toThrow();
      expect(() => CfnResourceMetadataContext.of(stack).set({ why: 'no CfnResource selected' })).not.toThrow();

      expect(() => synthesize(stack)).toThrow(/trust requires 'src'/);
      expect(() => synthesize(stack)).toThrow(NO_RESOURCE_SELECTED);
    });

    test('set() writes the value passed at call time even if the caller mutates it afterwards', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      const must = ['original rule'];
      const mutability: { [propertyName: string]: CfnContextMutability } = { Name: CfnContextMutability.MUST_NEVER_CHANGE };

      CfnResourceMetadataContext.of(res).set({ mutable: CfnContextMutability.FREE_TO_TUNE, must, mutability });
      must.push('added after set()');
      mutability.Arn = CfnContextMutability.FREE_TO_TUNE;

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        mutable: 'free-to-tune',
        must: ['original rule'],
        mutability: { Name: 'must-never-change' },
      });
    });

    test('set({}) writes an empty Context object', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(stack).set({}, { selector: ConstructSelector.all() });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({});
    });

    test('preserves explicit empty strings, arrays and maps', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({ why: '', must: [], mutability: {}, deps: [] });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: '',
        must: [],
        mutability: {},
        deps: [],
      });
    });

    test('blank strings are structurally valid and synthesize', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({
        why: '  ',
        must: ['  '],
        trust: { src: CfnContextTrustSource.AUTHORED, conf: CfnContextTrustConfidence.HIGH, cite: '  ', note: '  ' },
      });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: '  ',
        must: ['  '],
        trust: { src: 'authored', conf: 'high', cite: '  ', note: '  ' },
      });
    });

    test('trust-only block synthesizes', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({
        trust: { src: CfnContextTrustSource.AUTHORED, conf: CfnContextTrustConfidence.HIGH },
      });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        trust: { src: 'authored', conf: 'high' },
      });
    });

    test('deps-only block synthesizes', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({ deps: ['NetworkStack'] });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({ deps: ['NetworkStack'] });
    });

    test('fails synthesis when trust is provided without src', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({ why: 'x', trust: { conf: CfnContextTrustConfidence.HIGH } as any });

      expect(() => synthesize(stack)).toThrow(/trust requires 'src'/);
    });

    test('fails synthesis when trust is provided without conf', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({ why: 'x', trust: { src: CfnContextTrustSource.AUTHORED } as any });

      expect(() => synthesize(stack)).toThrow(/trust requires 'conf'/);
    });

    test.each([
      CfnContextMutability.MUST_NEVER_CHANGE,
      CfnContextMutability.CHANGE_WITH_CONSTRAINTS,
    ])('constrained mutable %s without a must rule synthesizes (recommendation not enforced)', mutability => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({ why: 'processes order events', mutable: mutability });

      expect(() => synthesize(stack)).not.toThrow();
    });

    test.each([
      CfnContextMutability.MUST_NEVER_CHANGE,
      CfnContextMutability.CHANGE_WITH_CONSTRAINTS,
    ])('constrained mutability %s without a must rule synthesizes (recommendation not enforced)', mutability => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({ why: 'processes order events', mutability: { Name: mutability } });

      expect(() => synthesize(stack)).not.toThrow();
    });

    test('fails synthesis when a mutability entry repeats mutable in the same set() call', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({
        mutable: CfnContextMutability.FREE_TO_TUNE,
        mutability: { Name: CfnContextMutability.FREE_TO_TUNE },
      });

      expect(() => synthesize(stack)).toThrow(/mutability entry 'Name' must not repeat mutable "free-to-tune"/);
    });

    test('allows mutability entries that deviate from mutable', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({
        mutable: CfnContextMutability.FREE_TO_TUNE,
        mutability: { Name: CfnContextMutability.MUST_NEVER_CHANGE },
      });

      expect(() => synthesize(stack)).not.toThrow();
    });

    test('allows mutability without a mutable', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({ mutability: { Name: CfnContextMutability.FREE_TO_TUNE } });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        mutability: { Name: 'free-to-tune' },
      });
    });
  });

  describe('template-level context', () => {
    test('renders a top-level namespaced Context metadata block', () => {
      const stack = new Stack();

      CfnTemplateMetadataContext.of(stack).set({
        arch: 'SQS buffer -> Lambda -> DynamoDB; DLQ for poison msgs',
        must: ['all data encrypted w/ security-team CMK'],
        owner: 'order-processing-team',
      });

      expect(toCloudFormation(stack).Metadata[CONTEXT_METADATA_KEY]).toEqual({
        arch: 'SQS buffer -> Lambda -> DynamoDB; DLQ for poison msgs',
        must: ['all data encrypted w/ security-team CMK'],
        owner: 'order-processing-team',
      });
    });

    test('writes template metadata immediately', () => {
      const stack = new Stack();

      CfnTemplateMetadataContext.of(stack).set({ owner: 'order-processing-team' });

      expect(stack.templateOptions.metadata?.[CONTEXT_METADATA_KEY]).toEqual({ owner: 'order-processing-team' });
    });

    test('ref entries render bare-string form when only a path is given', () => {
      const stack = new Stack();

      CfnTemplateMetadataContext.of(stack).set({
        ref: [
          { at: 'docs/network-context.yaml' },
          { at: 'docs/encryption-context.yaml', has: 'organization encryption and tagging rules', scope: 'shared' },
        ],
      });

      expect(toCloudFormation(stack).Metadata[CONTEXT_METADATA_KEY].ref).toEqual([
        'docs/network-context.yaml',
        { at: 'docs/encryption-context.yaml', has: 'organization encryption and tagging rules', scope: 'shared' },
      ]);
    });

    test('a second set() replaces the complete template Context', () => {
      const stack = new Stack();

      CfnTemplateMetadataContext.of(stack).set({ arch: 'first arch', must: ['rule 1'] });
      CfnTemplateMetadataContext.of(stack).set({ owner: 'platform-team' });

      expect(toCloudFormation(stack).Metadata[CONTEXT_METADATA_KEY]).toEqual({ owner: 'platform-team' });
    });

    test('clear() removes template Context, and a later set() writes it again', () => {
      const stack = new Stack();
      const templateContext = CfnTemplateMetadataContext.of(stack);

      templateContext.set({ arch: 'removed arch' });
      templateContext.clear();
      expect(stack.templateOptions.metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();

      templateContext.set({ arch: 'current arch' });
      expect(toCloudFormation(stack).Metadata[CONTEXT_METADATA_KEY]).toEqual({ arch: 'current arch' });
    });

    test('clear() keeps other template metadata keys', () => {
      const stack = new Stack();
      stack.addMetadata('SomeOtherKey', 'value');
      CfnTemplateMetadataContext.of(stack).set({ arch: 'the arch' });

      CfnTemplateMetadataContext.of(stack).clear();

      expect(toCloudFormation(stack).Metadata).toEqual({ SomeOtherKey: 'value' });
    });

    test('clear() on a stack without template metadata is a no-op', () => {
      const stack = new Stack();

      CfnTemplateMetadataContext.of(stack).clear();

      expect(toCloudFormation(stack).Metadata).toBeUndefined();
    });

    test('set() followed by clear() renders no template Metadata section', () => {
      const stack = new Stack();

      CfnTemplateMetadataContext.of(stack).set({ arch: 'removed arch' });
      CfnTemplateMetadataContext.of(stack).clear();

      expect(toCloudFormation(stack).Metadata).toBeUndefined();
    });

    test('set() replaces a Context block added with Stack.addMetadata()', () => {
      const stack = new Stack();
      stack.addMetadata(CONTEXT_METADATA_KEY, { arch: 'manual user value', must: ['manual user rule'] });

      CfnTemplateMetadataContext.of(stack).set({ arch: 'managed architecture' });

      expect(toCloudFormation(stack).Metadata[CONTEXT_METADATA_KEY]).toEqual({ arch: 'managed architecture' });
    });

    test('a later Stack.addMetadata() on the Context key replaces a set() value', () => {
      const stack = new Stack();
      CfnTemplateMetadataContext.of(stack).set({ arch: 'managed architecture' });

      stack.addMetadata(CONTEXT_METADATA_KEY, { arch: 'manual user value' });

      expect(toCloudFormation(stack).Metadata[CONTEXT_METADATA_KEY]).toEqual({ arch: 'manual user value' });
    });

    test('preserves manually added template Context when the API is not used', () => {
      const stack = new Stack();
      const manualContext = { arch: 'manual user value' };

      stack.addMetadata(CONTEXT_METADATA_KEY, manualContext);

      expect(toCloudFormation(stack).Metadata[CONTEXT_METADATA_KEY]).toEqual(manualContext);
    });

    test('preserves other template metadata keys', () => {
      const stack = new Stack();
      stack.addMetadata('SomeOtherKey', 'value');

      CfnTemplateMetadataContext.of(stack).set({ arch: 'the arch' });

      expect(toCloudFormation(stack).Metadata).toEqual({
        SomeOtherKey: 'value',
        [CONTEXT_METADATA_KEY]: { arch: 'the arch' },
      });
    });

    test('of(Stack.of(scope)) targets the enclosing stack from a nested scope', () => {
      const app = new App();
      const stack = new Stack(app, 'MyStack');
      const scope = new Construct(stack, 'Nested');

      CfnTemplateMetadataContext.of(Stack.of(scope)).set({ arch: 'nested-declared arch' });

      expect(toCloudFormation(stack).Metadata[CONTEXT_METADATA_KEY]).toEqual({ arch: 'nested-declared arch' });
    });

    test('inside a NestedStack targets the nested stack template, not the parent', () => {
      const app = new App();
      const parent = new Stack(app, 'ParentStack');
      const nested = new NestedStack(parent, 'Child');
      new CfnResource(nested, 'Res', { type: 'AWS::Fake::Thing' });

      CfnTemplateMetadataContext.of(nested).set({ arch: 'child-stack arch' });

      const assembly = app.synth();
      const parentTemplate = assembly.getStackByName(parent.stackName).template;
      const nestedTemplate = JSON.parse(fs.readFileSync(path.join(assembly.directory, nested.templateFile), 'utf-8'));
      expect(nestedTemplate.Metadata[CONTEXT_METADATA_KEY]).toEqual({ arch: 'child-stack arch' });
      expect(parentTemplate.Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('set({}) writes an empty template Context object', () => {
      const stack = new Stack();

      CfnTemplateMetadataContext.of(stack).set({});

      expect(toCloudFormation(stack).Metadata[CONTEXT_METADATA_KEY]).toEqual({});
    });

    test('preserves explicit empty template strings and arrays', () => {
      const stack = new Stack();

      CfnTemplateMetadataContext.of(stack).set({ arch: '', must: [], ref: [], owner: '' });

      expect(toCloudFormation(stack).Metadata[CONTEXT_METADATA_KEY]).toEqual({ arch: '', must: [], ref: [], owner: '' });
    });

    test.each<{
      readonly name: string;
      readonly path: string;
      readonly context: (token: string) => CfnTemplateContextProps;
    }>([
      { name: 'arch', path: 'arch', context: token => ({ arch: token }) },
      { name: 'must entry', path: 'must[0]', context: token => ({ must: [token] }) },
      { name: 'ref at', path: 'ref[0].at', context: token => ({ ref: [{ at: token }] }) },
      { name: 'ref has', path: 'ref[0].has', context: token => ({ ref: [{ at: 'docs/context.md', has: token }] }) },
      { name: 'ref scope', path: 'ref[0].scope', context: token => ({ ref: [{ at: 'docs/context.md', scope: token }] }) },
      { name: 'owner', path: 'owner', context: token => ({ owner: token }) },
    ])('throws before writing when template $name is an unresolved token', ({ path: fieldPath, context }) => {
      const stack = new Stack();
      const tokenTarget = new CfnResource(stack, 'TokenTarget', { type: 'AWS::Fake::Thing' });
      const setContext = () => CfnTemplateMetadataContext.of(stack).set(context(tokenTarget.ref));

      expect(setContext).toThrow(ValidationError);
      expect(setContext).toThrow(`template MetadataContext field '${fieldPath}' cannot contain unresolved tokens`);
      expect(stack.templateOptions.metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('throws before inspecting an unresolved template list token', () => {
      const stack = new Stack();
      const setContext = () => CfnTemplateMetadataContext.of(stack).set({
        must: Lazy.list({ produce: () => ['resolved rule'] }),
      });

      expect(setContext).toThrow(ValidationError);
      expect(setContext).toThrow("template MetadataContext field 'must' cannot contain unresolved tokens");
      expect(stack.templateOptions.metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('a blank ref at path is structurally valid and synthesizes', () => {
      const stack = new Stack();

      CfnTemplateMetadataContext.of(stack).set({ ref: [{ at: ' ' }] });

      expect(toCloudFormation(stack).Metadata[CONTEXT_METADATA_KEY].ref).toEqual([' ']);
    });

    test('throws when a ref is missing its at path', () => {
      const stack = new Stack();

      expect(() => CfnTemplateMetadataContext.of(stack).set({ ref: [{ has: 'no at here' } as any] })).toThrow(ValidationError);
      expect(() => CfnTemplateMetadataContext.of(stack).set({ ref: [{ has: 'no at here' } as any] })).toThrow(/ref entries require an 'at' path/);
      expect(stack.templateOptions.metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test.each([
      'https://example.com/context.md',
      's3://example-bucket/context.yaml',
      '/absolute/context.yaml',
      'C:\\absolute\\context.yaml',
      '~/context.yaml',
      '../outside/context.yaml',
      'docs/../../outside/context.yaml',
    ])('accepts any ref URI or path (advisory schema does not enforce scope) %s', at => {
      const stack = new Stack();

      CfnTemplateMetadataContext.of(stack).set({ ref: [{ at }] });

      expect(toCloudFormation(stack).Metadata[CONTEXT_METADATA_KEY].ref).toEqual([at]);
    });
  });

  describe('schema conformance', () => {
    test('emitted resource block uses only advisory schema fields', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).set({
        why: 'w',
        must: ['m'],
        mutable: CfnContextMutability.FREE_TO_TUNE,
        mutability: { Prop: CfnContextMutability.REVIEW_REQUIRED },
        trust: { src: CfnContextTrustSource.AUTHORED, conf: CfnContextTrustConfidence.HIGH },
        deps: ['d'],
      });

      const context = toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY];
      expect(Object.keys(context).sort()).toEqual(['deps', 'must', 'mutability', 'mutable', 'trust', 'why']);
      expect(context.mutable).toEqual('free-to-tune');
      expect(context.mutability.Prop).toEqual('review-required');
      expect(context.trust).toEqual({ src: 'authored', conf: 'high' });
    });

    test('emitted template block uses only advisory schema fields', () => {
      const stack = new Stack();

      CfnTemplateMetadataContext.of(stack).set({
        arch: 'a',
        must: ['m'],
        ref: [{ at: 'docs/context.yaml' }],
        owner: 'o',
      });

      expect(Object.keys(toCloudFormation(stack).Metadata[CONTEXT_METADATA_KEY]).sort()).toEqual(['arch', 'must', 'owner', 'ref']);
    });

    test('enum values match the advisory schema vocabulary', () => {
      // Drift check per the schema's consumer-update strategy: these string
      // values are FROZEN for the advisory schema. If this test fails, the emitted
      // values no longer match the published schema.
      expect(Object.values(CfnContextMutability).sort()).toEqual([
        'change-with-constraints',
        'free-to-tune',
        'must-never-change',
        'review-required',
      ]);
      expect(Object.values(CfnContextTrustSource).sort()).toEqual([
        'authored',
        'comment',
        'commit',
        'infer',
      ]);
      expect(Object.values(CfnContextTrustConfidence).sort()).toEqual([
        'high',
        'low',
        'medium',
      ]);
    });
  });
});

function readNestedTemplate(app: App, nested: NestedStack): any {
  const assembly = app.synth();
  return JSON.parse(fs.readFileSync(path.join(assembly.directory, nested.templateFile), 'utf-8'));
}
