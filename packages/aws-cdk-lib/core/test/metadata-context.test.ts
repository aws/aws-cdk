import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import { toCloudFormation } from './util';
import {
  App,
  CfnResource,
  ContextMutability,
  ContextTrustConfidence,
  ContextTrustSource,
  MetadataContext,
  NestedStack,
  Stack,
  UnscopedValidationError,
} from '../lib';

describe('metadata context', () => {
  describe('resource-level context', () => {
    test('renders a Metadata.Context block on a CfnResource', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Queue', { type: 'AWS::SQS::Queue' });

      MetadataContext.of(res).add({
        why: 'buffer order events async; 14d retention = compliance window',
        must: ['VisTimeout >= 6x fn timeout, else dup on retry'],
        mutable: ContextMutability.CHANGE_WITH_CONSTRAINTS,
        mutability: { QueueName: ContextMutability.MUST_NEVER_CHANGE },
        ops: 'check ApproxAgeOfOldestMsg before cutting VisTimeout',
        gaps: ['memory sizing never load-tested'],
        deps: ['NetworkStack'],
        failureModes: ['retry 3x w/ exp backoff before DLQ'],
      });

      const template = toCloudFormation(stack);
      expect(template.Resources.Queue.Metadata.Context).toEqual({
        why: 'buffer order events async; 14d retention = compliance window',
        must: ['VisTimeout >= 6x fn timeout, else dup on retry'],
        mutable: 'change-with-constraints',
        mutability: { QueueName: 'must-never-change' },
        ops: 'check ApproxAgeOfOldestMsg before cutting VisTimeout',
        gaps: ['memory sizing never load-tested'],
        deps: ['NetworkStack'],
        failureModes: ['retry 3x w/ exp backoff before DLQ'],
      });
    });

    test('renders trust with wire-format keys src/conf/cite/note', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      MetadataContext.of(res).add({
        why: 'inferred from retry wrapper',
        trust: {
          source: ContextTrustSource.INFERRED,
          confidence: ContextTrustConfidence.LOW,
          citation: 'api/handler.ts:87',
          note: 'inferred from retry wrapper; no explicit doc found',
        },
      });

      const template = toCloudFormation(stack);
      expect(template.Resources.Res.Metadata.Context.trust).toEqual({
        src: 'infer',
        conf: 'low',
        cite: 'api/handler.ts:87',
        note: 'inferred from retry wrapper; no explicit doc found',
      });
    });

    test('trust defaults to authored source with medium confidence', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      MetadataContext.of(res).add({
        why: 'authored rationale',
        trust: {},
      });

      const template = toCloudFormation(stack);
      expect(template.Resources.Res.Metadata.Context.trust).toEqual({
        src: 'authored',
        conf: 'medium',
      });
    });

    test('omits absent fields entirely', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      MetadataContext.of(res).add({ why: 'only rationale' });

      const template = toCloudFormation(stack);
      expect(template.Resources.Res.Metadata.Context).toEqual({ why: 'only rationale' });
    });

    test('context added on a scope cascades to resources in that scope', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      MetadataContext.of(scope).add({ why: 'part of ingest subsystem' });

      const template = toCloudFormation(stack);
      const logicalId = stack.getLogicalId(res);
      expect(template.Resources[logicalId].Metadata.Context).toEqual({
        why: 'part of ingest subsystem',
      });
    });

    test('nearest-wins: scalar fields from closer scopes override outer scopes', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      MetadataContext.of(scope).add({
        why: 'outer rationale',
        mutable: ContextMutability.FREE_TO_TUNE,
        must: ['outer invariant'],
      });
      MetadataContext.of(res).add({
        why: 'inner rationale',
        must: ['inner invariant'],
      });

      const template = toCloudFormation(stack);
      const logicalId = stack.getLogicalId(res);
      expect(template.Resources[logicalId].Metadata.Context).toEqual({
        why: 'inner rationale',
        mutable: 'free-to-tune',
        must: ['outer invariant', 'inner invariant'],
      });
    });

    test('list fields accumulate across scopes and de-duplicate', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      MetadataContext.of(scope).add({ must: ['shared rule', 'outer rule'] });
      MetadataContext.of(res).add({ must: ['shared rule', 'inner rule'] });

      const template = toCloudFormation(stack);
      const logicalId = stack.getLogicalId(res);
      expect(template.Resources[logicalId].Metadata.Context.must).toEqual([
        'shared rule',
        'outer rule',
        'inner rule',
      ]);
    });

    test('mutability maps merge per key with nearest-wins per property', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      MetadataContext.of(scope).add({
        mutability: {
          QueueName: ContextMutability.REVIEW_REQUIRED,
          VisibilityTimeout: ContextMutability.CHANGE_WITH_CONSTRAINTS,
        },
      });
      MetadataContext.of(res).add({
        mutability: { QueueName: ContextMutability.MUST_NEVER_CHANGE },
      });

      const template = toCloudFormation(stack);
      const logicalId = stack.getLogicalId(res);
      expect(template.Resources[logicalId].Metadata.Context.mutability).toEqual({
        QueueName: 'must-never-change',
        VisibilityTimeout: 'change-with-constraints',
      });
    });

    test('multiple add() calls on the same scope merge', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      MetadataContext.of(res).add({ why: 'first rationale', must: ['rule 1'] });
      MetadataContext.of(res).add({ why: 'second rationale', must: ['rule 2'] });

      const template = toCloudFormation(stack);
      expect(template.Resources.Res.Metadata.Context).toEqual({
        why: 'second rationale',
        must: ['rule 1', 'rule 2'],
      });
    });

    test('primary-only targeting: skips non-default-child helper resources', () => {
      const stack = new Stack();

      // Model an L2-style construct: primary resource is the defaultChild,
      // helper resource (e.g. an auto-created IAM role) is not.
      const l2 = new Construct(stack, 'MyQueue');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::SQS::Queue' });
      l2.node.defaultChild = primary;
      const helper = new CfnResource(l2, 'HelperRole', { type: 'AWS::IAM::Role' });

      MetadataContext.of(l2).add({ why: 'buffers events' });

      const template = toCloudFormation(stack);
      const primaryId = stack.getLogicalId(primary);
      const helperId = stack.getLogicalId(helper);
      expect(template.Resources[primaryId].Metadata.Context).toEqual({ why: 'buffers events' });
      expect(template.Resources[helperId].Metadata?.Context).toBeUndefined();
    });

    test('cascades through grouping constructs to nested L2 primaries', () => {
      const stack = new Stack();

      // A plain grouping construct (no defaultChild) containing an
      // L2-modeled construct whose primary is its defaultChild.
      const group = new Construct(stack, 'SubSystem');
      const l2 = new Construct(group, 'Topic');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::SNS::Topic' });
      l2.node.defaultChild = primary;
      const helper = new CfnResource(l2, 'Policy', { type: 'AWS::SNS::TopicPolicy' });

      MetadataContext.of(group).add({ why: 'alert fan-out' });

      const template = toCloudFormation(stack);
      const primaryId = stack.getLogicalId(primary);
      const helperId = stack.getLogicalId(helper);
      expect(template.Resources[primaryId].Metadata.Context).toEqual({ why: 'alert fan-out' });
      expect(template.Resources[helperId].Metadata?.Context).toBeUndefined();
    });

    test('applyToAllResources renders onto helper resources too', () => {
      const stack = new Stack();
      const l2 = new Construct(stack, 'MyQueue');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::SQS::Queue' });
      l2.node.defaultChild = primary;
      const helper = new CfnResource(l2, 'HelperRole', { type: 'AWS::IAM::Role' });

      MetadataContext.of(l2).add({ why: 'buffers events' }, { applyToAllResources: true });

      const template = toCloudFormation(stack);
      const helperId = stack.getLogicalId(helper);
      expect(template.Resources[helperId].Metadata.Context).toEqual({ why: 'buffers events' });
    });

    test('include/exclude resource type filters', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const queue = new CfnResource(scope, 'Queue', { type: 'AWS::SQS::Queue' });
      const topic = new CfnResource(scope, 'Topic', { type: 'AWS::SNS::Topic' });

      MetadataContext.of(scope).add(
        { why: 'queue-specific context' },
        { includeResourceTypes: ['AWS::SQS::Queue'] },
      );
      MetadataContext.of(scope).add(
        { ops: 'watch everything except queues' },
        { excludeResourceTypes: ['AWS::SQS::Queue'] },
      );

      const template = toCloudFormation(stack);
      const queueId = stack.getLogicalId(queue);
      const topicId = stack.getLogicalId(topic);
      expect(template.Resources[queueId].Metadata.Context).toEqual({ why: 'queue-specific context' });
      expect(template.Resources[topicId].Metadata.Context).toEqual({ ops: 'watch everything except queues' });
    });

    test('explicit addMetadata Context on the resource wins over aspect-provided context', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      res.addMetadata('Context', { why: 'hand-written why', must: ['hand-written rule'] });

      MetadataContext.of(res).add({ why: 'aspect why', ops: 'aspect ops' });

      const template = toCloudFormation(stack);
      expect(template.Resources.Res.Metadata.Context).toEqual({
        why: 'hand-written why',
        must: ['hand-written rule'],
        ops: 'aspect ops',
      });
    });

    test('no Metadata.Context emitted for resources with no applicable context', () => {
      const stack = new Stack();
      const withContext = new CfnResource(stack, 'A', { type: 'AWS::Fake::Thing' });
      new CfnResource(stack, 'B', { type: 'AWS::Fake::Thing' });

      MetadataContext.of(withContext).add({ why: 'has context' });

      const template = toCloudFormation(stack);
      expect(template.Resources.A.Metadata.Context).toBeDefined();
      expect(template.Resources.B.Metadata?.Context).toBeUndefined();
    });

    test('throws on empty context block', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      expect(() => MetadataContext.of(res).add({})).toThrow(UnscopedValidationError);
      expect(() => MetadataContext.of(res).add({ must: [] })).toThrow(UnscopedValidationError);
    });

    test('throws on empty list entries', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      expect(() => MetadataContext.of(res).add({ must: ['  '] })).toThrow(/non-empty strings/);
    });
  });

  describe('template-level context', () => {
    test('renders a top-level Metadata.Context block', () => {
      const stack = new Stack();

      MetadataContext.of(stack).addToTemplate({
        arch: 'SQS buffer -> Lambda -> DynamoDB; DLQ for poison msgs',
        must: ['all data encrypted w/ security-team CMK'],
        owner: 'order-processing@',
      });

      const template = toCloudFormation(stack);
      expect(template.Metadata.Context).toEqual({
        arch: 'SQS buffer -> Lambda -> DynamoDB; DLQ for poison msgs',
        must: ['all data encrypted w/ security-team CMK'],
        owner: 'order-processing@',
      });
    });

    test('refs render bare-string form when only a URI is given', () => {
      const stack = new Stack();

      MetadataContext.of(stack).addToTemplate({
        refs: [
          { at: 's3://org-iac-ctx/shared/net.ctx.yaml' },
          { at: 's3://org-iac-ctx/shared/encryption.ctx.yaml', has: 'org CMK + tagging rules', scope: 'shared' },
        ],
      });

      const template = toCloudFormation(stack);
      expect(template.Metadata.Context.ref).toEqual([
        's3://org-iac-ctx/shared/net.ctx.yaml',
        { at: 's3://org-iac-ctx/shared/encryption.ctx.yaml', has: 'org CMK + tagging rules', scope: 'shared' },
      ]);
    });

    test('multiple addToTemplate calls merge (scalars win, lists accumulate)', () => {
      const stack = new Stack();

      MetadataContext.of(stack).addToTemplate({ arch: 'first arch', must: ['rule 1'] });
      MetadataContext.of(stack).addToTemplate({ arch: 'second arch', must: ['rule 2'], owner: 'team@' });

      const template = toCloudFormation(stack);
      expect(template.Metadata.Context).toEqual({
        arch: 'second arch',
        must: ['rule 1', 'rule 2'],
        owner: 'team@',
      });
    });

    test('addToTemplate from a nested scope targets the enclosing stack', () => {
      const app = new App();
      const stack = new Stack(app, 'MyStack');
      const scope = new Construct(stack, 'Nested');
      new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      MetadataContext.of(scope).addToTemplate({ arch: 'nested-declared arch' });

      const template = toCloudFormation(stack);
      expect(template.Metadata.Context.arch).toEqual('nested-declared arch');
    });

    test('addToTemplate inside a NestedStack targets the nested stack template, not the parent', () => {
      const app = new App();
      const parent = new Stack(app, 'ParentStack');
      const nested = new NestedStack(parent, 'Child');
      new CfnResource(nested, 'Res', { type: 'AWS::Fake::Thing' });

      MetadataContext.of(nested).addToTemplate({ arch: 'child-stack arch' });
      MetadataContext.of(nested).add({ why: 'nested resource rationale' });

      const assembly = app.synth();
      const parentTemplate = assembly.getStackByName(parent.stackName).template;
      // The nested stack's template is written as a separate cloud-assembly file
      const nestedTemplate = JSON.parse(
        fs.readFileSync(path.join(assembly.directory, nested.templateFile), 'utf-8'),
      );

      expect(nestedTemplate.Metadata.Context).toEqual({ arch: 'child-stack arch' });
      expect(nestedTemplate.Resources.Res.Metadata.Context).toEqual({ why: 'nested resource rationale' });
      expect(parentTemplate.Metadata?.Context).toBeUndefined();
    });

    test('context added on the parent stack cascades into nested stack resources', () => {
      const app = new App();
      const parent = new Stack(app, 'ParentStack');
      const nested = new NestedStack(parent, 'Child');
      new CfnResource(nested, 'Res', { type: 'AWS::Fake::Thing' });

      MetadataContext.of(parent).add({ must: ['all data encrypted w/ CMK'] });

      const assembly = app.synth();
      const nestedTemplate = JSON.parse(
        fs.readFileSync(path.join(assembly.directory, nested.templateFile), 'utf-8'),
      );

      expect(nestedTemplate.Resources.Res.Metadata.Context).toEqual({
        must: ['all data encrypted w/ CMK'],
      });
    });

    test('preserves other template metadata keys', () => {
      const stack = new Stack();
      stack.addMetadata('SomeOtherKey', 'value');

      MetadataContext.of(stack).addToTemplate({ arch: 'the arch' });

      const template = toCloudFormation(stack);
      expect(template.Metadata.SomeOtherKey).toEqual('value');
      expect(template.Metadata.Context.arch).toEqual('the arch');
    });

    test('throws on empty template context', () => {
      const stack = new Stack();
      expect(() => MetadataContext.of(stack).addToTemplate({})).toThrow(UnscopedValidationError);
    });

    test('throws on empty ref URI', () => {
      const stack = new Stack();
      expect(() => MetadataContext.of(stack).addToTemplate({ refs: [{ at: ' ' }] })).toThrow(/non-empty 'at' URI/);
    });
  });

  describe('schema conformance', () => {
    test('emitted resource block uses only v1 schema fields', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      MetadataContext.of(res).add({
        why: 'w',
        must: ['m'],
        mutable: ContextMutability.FREE_TO_TUNE,
        mutability: { Prop: ContextMutability.REVIEW_REQUIRED },
        trust: { source: ContextTrustSource.AUTHORED, confidence: ContextTrustConfidence.HIGH },
        ops: 'o',
        gaps: ['g'],
        deps: ['d'],
        failureModes: ['f'],
      });

      const template = toCloudFormation(stack);
      const context = template.Resources.Res.Metadata.Context;
      const v1ResourceFields = ['why', 'must', 'mutable', 'mutability', 'trust', 'ops', 'gaps', 'deps', 'failureModes'];
      expect(Object.keys(context).sort()).toEqual([...v1ResourceFields].sort());
      // Enum wire values are the frozen v1 tokens
      expect(context.mutable).toEqual('free-to-tune');
      expect(context.mutability.Prop).toEqual('review-required');
      expect(context.trust).toEqual({ src: 'authored', conf: 'high' });
    });

    test('emitted template block uses only v1 schema fields', () => {
      const stack = new Stack();

      MetadataContext.of(stack).addToTemplate({
        arch: 'a',
        must: ['m'],
        refs: [{ at: 's3://x/y' }],
        owner: 'o',
      });

      const template = toCloudFormation(stack);
      expect(Object.keys(template.Metadata.Context).sort()).toEqual(['arch', 'must', 'owner', 'ref']);
    });

    test('enum wire values match the frozen v1 schema vocabulary', () => {
      // Drift check per the schema's consumer-update strategy: these string
      // values are FROZEN for schema v1. If this test fails, the emitted
      // wire format no longer matches the pinned schema version.
      expect(Object.values(ContextMutability).sort()).toEqual([
        'change-with-constraints',
        'free-to-tune',
        'must-never-change',
        'review-required',
      ]);
      expect(Object.values(ContextTrustSource).sort()).toEqual([
        'authored',
        'comment',
        'commit',
        'infer',
      ]);
      expect(Object.values(ContextTrustConfidence).sort()).toEqual([
        'high',
        'low',
        'medium',
      ]);
    });
  });
});
