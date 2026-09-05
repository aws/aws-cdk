import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import {
  App,
  CfnResource,
  ContextMutability,
  ContextTrustConfidence,
  ContextTrustSource,
  NestedStack,
  ResourceMetadataContext,
  Stack,
  Stage,
  TemplateMetadataContext,
  UnscopedValidationError,
} from '../lib';
import { toCloudFormation } from './util';
import { synthesize } from '../lib/private/synthesis';

const CONTEXT_METADATA_KEY = 'com.aws.cloudformation.Context';

describe('metadata context', () => {
  describe('resource-level context', () => {
    test('renders a namespaced Context metadata block on a CfnResource', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Queue', { type: 'AWS::SQS::Queue' });

      ResourceMetadataContext.of(res).add({
        why: 'buffer order events async; 14d retention = compliance window',
        must: ['VisTimeout >= 6x fn timeout, else dup on retry'],
        defaultMutability: ContextMutability.CHANGE_WITH_CONSTRAINTS,
        propertyMutability: { QueueName: ContextMutability.MUST_NEVER_CHANGE },
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

    test('defaultMutability/propertyMutability render under the canonical wire keys', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(res).add({
        why: 'resource name is referenced by an external consumer',
        must: ['Name must not change because replacement loses the external reference'],
        defaultMutability: ContextMutability.FREE_TO_TUNE,
        propertyMutability: { Name: ContextMutability.MUST_NEVER_CHANGE },
      });

      const context = toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY];
      expect(context.mutable).toEqual('free-to-tune');
      expect(context.mutability).toEqual({ Name: 'must-never-change' });
      expect(context.defaultMutability).toBeUndefined();
      expect(context.propertyMutability).toBeUndefined();
    });

    test('emits no trust block when trust is not supplied', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(res).add({ why: 'no trust recorded here', must: ['a rule'] });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'no trust recorded here',
        must: ['a rule'],
      });
    });

    test('renders explicit trust with wire-format keys src/conf/cite/note', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(res).add({
        why: 'absorb transient processor failures without dropping orders',
        trust: {
          source: ContextTrustSource.INFERRED,
          confidence: ContextTrustConfidence.LOW,
          citation: 'api/handler.ts:87',
          note: 'rationale inferred from retry wrapper; no explicit design doc found',
        },
      });

      const template = toCloudFormation(stack);
      expect(template.Resources.Res.Metadata[CONTEXT_METADATA_KEY].trust).toEqual({
        src: 'infer',
        conf: 'low',
        cite: 'api/handler.ts:87',
        note: 'rationale inferred from retry wrapper; no explicit design doc found',
      });
    });

    test('default targeting applies to the scope when it is a CfnResource', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(res).add({ why: 'on the resource itself' });

      const template = toCloudFormation(stack);
      expect(template.Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toMatchObject({ why: 'on the resource itself' });
    });

    test('default targeting applies down the defaultChild chain but skips helper resources', () => {
      const stack = new Stack();

      // Model an L2-style construct: primary resource is the defaultChild,
      // helper resource (e.g. an auto-created IAM role) is not.
      const l2 = new Construct(stack, 'MyQueue');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::SQS::Queue' });
      l2.node.defaultChild = primary;
      const helper = new CfnResource(l2, 'HelperRole', { type: 'AWS::IAM::Role' });

      ResourceMetadataContext.of(l2).add({ why: 'buffers events' });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(primary)].Metadata[CONTEXT_METADATA_KEY]).toMatchObject({ why: 'buffers events' });
      expect(template.Resources[stack.getLogicalId(helper)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('default targeting fails when a grouping construct has no primary resource', () => {
      const stack = new Stack();
      const group = new Construct(stack, 'SubSystem');
      new CfnResource(group, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(group).add({ why: 'grouping rationale' });

      expect(() => synthesize(stack)).toThrow(
        /resource context declaration matched no CloudFormation resources.*applyToDescendants/,
      );
    });

    test('default targeting fails from a Stack scope', () => {
      const stack = new Stack();
      // `Resource` is a special defaultChild id in constructs; Stack remains
      // a structural boundary even when a direct child has that id.
      new CfnResource(stack, 'Resource', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(stack).add({ why: 'stack-wide but narrow by default' });

      expect(() => synthesize(stack)).toThrow(
        /resource context declaration matched no CloudFormation resources.*applyToDescendants/,
      );
    });

    test('applyToDescendants cascades through grouping constructs to nested L2 primaries and skips helpers', () => {
      const stack = new Stack();

      const group = new Construct(stack, 'SubSystem');
      const l2 = new Construct(group, 'Topic');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::SNS::Topic' });
      l2.node.defaultChild = primary;
      const helper = new CfnResource(l2, 'Policy', { type: 'AWS::SNS::TopicPolicy' });

      ResourceMetadataContext.of(group).add({ why: 'alert fan-out' }, { applyToDescendants: true });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(primary)].Metadata[CONTEXT_METADATA_KEY]).toMatchObject({ why: 'alert fan-out' });
      expect(template.Resources[stack.getLogicalId(helper)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('applyToDescendants cascades from a stack scope to its resources', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(stack).add({ why: 'resource belongs to the networked subsystem', deps: ['NetworkStack'] }, { applyToDescendants: true });

      const template = toCloudFormation(stack);
      expect(template.Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toMatchObject({ deps: ['NetworkStack'] });
    });

    test('resource context inside a Stage matches resources in that assembly', () => {
      const app = new App();
      const stage = new Stage(app, 'Deployment');
      const stack = new Stack(stage, 'Stack');
      new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(stack).add({ why: 'stage resource' }, { applyToDescendants: true });

      expect(() => stage.synth()).not.toThrow();
    });

    test('resource context does not silently cross Stage assembly boundaries', () => {
      const app = new App();
      const stage = new Stage(app, 'Deployment');
      const stack = new Stack(stage, 'Stack');
      new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(app).add({ why: 'outside assembly' }, { applyToDescendants: true });

      expect(() => app.synth()).toThrow(
        /resource context declaration matched no CloudFormation resources.*inside each Stage/,
      );
    });

    test('an in-Stage declaration does not render context from above the Stage boundary', () => {
      const app = new App();
      const rootStack = new Stack(app, 'RootStack');
      new CfnResource(rootStack, 'RootRes', { type: 'AWS::Fake::Thing' });
      ResourceMetadataContext.of(app).add({ why: 'resources belong to the root assembly', must: ['root assembly rule'] }, { applyToAllResources: true });

      const stage = new Stage(app, 'Deployment');
      const stack = new Stack(stage, 'StageStack');
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      ResourceMetadataContext.of(stack).add({ why: 'stage resource' }, { applyToDescendants: true });

      const template = stage.synth().getStackByName(stack.stackName).template;
      expect(template.Resources[stack.getLogicalId(res)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'stage resource',
      });
    });

    test('applyToAllResources renders onto helper resources too', () => {
      const stack = new Stack();
      const l2 = new Construct(stack, 'MyQueue');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::SQS::Queue' });
      l2.node.defaultChild = primary;
      const helper = new CfnResource(l2, 'HelperRole', { type: 'AWS::IAM::Role' });

      ResourceMetadataContext.of(l2).add({ why: 'buffers events' }, { applyToAllResources: true });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(primary)].Metadata[CONTEXT_METADATA_KEY]).toMatchObject({ why: 'buffers events' });
      expect(template.Resources[stack.getLogicalId(helper)].Metadata[CONTEXT_METADATA_KEY]).toMatchObject({ why: 'buffers events' });
    });

    test('ambiguous defaultChild fails with an actionable zero-target error', () => {
      const stack = new Stack();
      const ambiguous = new Construct(stack, 'Ambiguous');
      new CfnResource(ambiguous, 'Resource', { type: 'AWS::Fake::Thing' });
      // A sibling with id "Default" makes node.defaultChild ambiguous (it throws).
      new CfnResource(ambiguous, 'Default', { type: 'AWS::Fake::Other' });

      ResourceMetadataContext.of(ambiguous).add({ why: 'x' });

      expect(() => synthesize(stack)).toThrow(
        /resource context declaration matched no CloudFormation resources.*defaultChild/,
      );
    });

    test('revalidates targets and clears stale render state on repeated synthesis', () => {
      const stack = new Stack();
      const l2 = new Construct(stack, 'MyQueue');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::SQS::Queue' });
      const nonResource = new Construct(l2, 'NotAResource');
      l2.node.defaultChild = primary;

      ResourceMetadataContext.of(l2).add({ why: 'buffers events' });

      const firstTemplate = synthesize(stack).getStackByName(stack.stackName).template;
      const logicalId = stack.getLogicalId(primary);
      expect(firstTemplate.Resources[logicalId].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'buffers events',
      });

      l2.node.defaultChild = nonResource;
      const secondTemplate = synthesize(stack, { skipValidation: true }).getStackByName(stack.stackName).template;
      expect(secondTemplate.Resources[logicalId].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
      expect(() => synthesize(stack)).toThrow(
        /resource context declaration matched no CloudFormation resources.*defaultChild/,
      );
    });

    test('nearest-wins: scalar fields from closer scopes override outer scopes', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(scope).add({
        why: 'outer rationale',
        defaultMutability: ContextMutability.FREE_TO_TUNE,
        must: ['outer invariant'],
      }, { applyToDescendants: true });
      ResourceMetadataContext.of(res).add({
        why: 'inner rationale',
        must: ['inner invariant'],
      });

      const template = toCloudFormation(stack);
      const logicalId = stack.getLogicalId(res);
      expect(template.Resources[logicalId].Metadata[CONTEXT_METADATA_KEY]).toMatchObject({
        why: 'inner rationale',
        mutable: 'free-to-tune',
        must: ['outer invariant', 'inner invariant'],
      });
    });

    test('list fields accumulate across scopes and de-duplicate', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(scope).add({ why: 'shared subsystem resource', must: ['shared rule', 'outer rule'] }, { applyToDescendants: true });
      ResourceMetadataContext.of(res).add({ must: ['shared rule', 'inner rule'] });

      const template = toCloudFormation(stack);
      const logicalId = stack.getLogicalId(res);
      expect(template.Resources[logicalId].Metadata[CONTEXT_METADATA_KEY].must).toEqual([
        'shared rule',
        'outer rule',
        'inner rule',
      ]);
    });

    test('propertyMutability maps merge per key with nearest-wins per property', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(scope).add({
        why: 'queue settings preserve order-processing behavior',
        must: ['VisibilityTimeout changes must preserve the retry timing relationship'],
        propertyMutability: {
          QueueName: ContextMutability.REVIEW_REQUIRED,
          VisibilityTimeout: ContextMutability.CHANGE_WITH_CONSTRAINTS,
        },
      }, { applyToDescendants: true });
      ResourceMetadataContext.of(res).add({
        must: ['QueueName must not change because replacement loses the external reference'],
        propertyMutability: { QueueName: ContextMutability.MUST_NEVER_CHANGE },
      });

      const template = toCloudFormation(stack);
      const logicalId = stack.getLogicalId(res);
      expect(template.Resources[logicalId].Metadata[CONTEXT_METADATA_KEY].mutability).toEqual({
        QueueName: 'must-never-change',
        VisibilityTimeout: 'change-with-constraints',
      });
    });

    test('inheritAncestorContext defaults to inheriting merged ancestor context', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(scope).add({ must: ['ancestor rule'] }, { applyToDescendants: true });
      ResourceMetadataContext.of(res).add({ why: 'leaf rationale' });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(res)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        must: ['ancestor rule'],
        why: 'leaf rationale',
      });
    });

    test('inheritAncestorContext=false resets previously merged ancestor context', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(scope).add({ must: ['ancestor rule'], why: 'ancestor rationale' }, { applyToDescendants: true });
      ResourceMetadataContext.of(res).add({ why: 'leaf rationale' }, { inheritAncestorContext: false });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(res)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'leaf rationale',
      });
    });

    test('inheritAncestorContext=false preserves all declarations on the same scope', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(scope).add({ must: ['ancestor rule'] }, { applyToDescendants: true });
      ResourceMetadataContext.of(res).add({ must: ['same-scope rule'] });
      ResourceMetadataContext.of(res).add({ why: 'leaf rationale' }, { inheritAncestorContext: false });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(res)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        must: ['same-scope rule'],
        why: 'leaf rationale',
      });
    });

    test('multiple add() calls on the same scope merge', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(res).add({ why: 'first rationale', must: ['rule 1'] });
      ResourceMetadataContext.of(res).add({ why: 'second rationale', must: ['rule 2'] });

      const template = toCloudFormation(stack);
      expect(template.Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toMatchObject({
        why: 'second rationale',
        must: ['rule 1', 'rule 2'],
      });
    });

    test('include/exclude resource type filters', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const queue = new CfnResource(scope, 'Queue', { type: 'AWS::SQS::Queue' });
      const topic = new CfnResource(scope, 'Topic', { type: 'AWS::SNS::Topic' });

      ResourceMetadataContext.of(scope).add(
        { why: 'queue-specific context' },
        { applyToDescendants: true, includeResourceTypes: ['AWS::SQS::Queue'] },
      );
      ResourceMetadataContext.of(scope).add(
        { why: 'non-queue subsystem resource' },
        { applyToDescendants: true, excludeResourceTypes: ['AWS::SQS::Queue'] },
      );

      const template = toCloudFormation(stack);
      const queueId = stack.getLogicalId(queue);
      const topicId = stack.getLogicalId(topic);
      expect(template.Resources[queueId].Metadata[CONTEXT_METADATA_KEY]).toMatchObject({ why: 'queue-specific context' });
      expect(template.Resources[topicId].Metadata[CONTEXT_METADATA_KEY]).toMatchObject({ why: 'non-queue subsystem resource' });
    });

    test('fails when resource type filters match no resources', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      new CfnResource(scope, 'Topic', { type: 'AWS::SNS::Topic' });

      ResourceMetadataContext.of(scope).add(
        { why: 'queue-only rationale' },
        { applyToDescendants: true, includeResourceTypes: ['AWS::SQS::Queue'] },
      );

      expect(() => synthesize(stack)).toThrow(
        /resource context declaration matched no CloudFormation resources.*resource type filters/,
      );
    });

    test('fails when excludeResourceTypes removes every target', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Queue', { type: 'AWS::SQS::Queue' });

      ResourceMetadataContext.of(res).add(
        { why: 'excluded rationale' },
        { excludeResourceTypes: ['AWS::SQS::Queue'] },
      );

      expect(() => synthesize(stack)).toThrow(
        /resource context declaration matched no CloudFormation resources.*resource type filters/,
      );
    });

    test('each declaration must independently match at least one resource', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      new CfnResource(scope, 'Queue', { type: 'AWS::SQS::Queue' });

      ResourceMetadataContext.of(scope).add(
        { why: 'queue rationale' },
        { applyToDescendants: true, includeResourceTypes: ['AWS::SQS::Queue'] },
      );
      ResourceMetadataContext.of(scope).add(
        { why: 'topic rationale' },
        { applyToDescendants: true, includeResourceTypes: ['AWS::SNS::Topic'] },
      );

      expect(() => synthesize(stack)).toThrow(
        /resource context declaration matched no CloudFormation resources.*resource type filters/,
      );
    });

    test('applyToDescendants fails on an empty scope', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'Empty');

      ResourceMetadataContext.of(scope).add({ why: 'no targets' }, { applyToDescendants: true });

      expect(() => synthesize(stack)).toThrow(
        /resource context declaration matched no CloudFormation resources/,
      );
    });

    test('applyToAllResources fails on an empty scope', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'Empty');

      ResourceMetadataContext.of(scope).add({ why: 'no targets' }, { applyToAllResources: true });

      expect(() => synthesize(stack)).toThrow(
        /resource context declaration matched no CloudFormation resources/,
      );
    });

    test('preserves manually added Context when the API is not used', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      const manualContext = { why: 'manual user value' };

      res.addMetadata(CONTEXT_METADATA_KEY, manualContext);

      const template = toCloudFormation(stack);
      expect(template.Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual(manualContext);
      expect(res.getMetadata(CONTEXT_METADATA_KEY)).toEqual(manualContext);
    });

    test('preserves independently defined tool metadata on a resource', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      res.addMetadata('com.example.ToolMetadata', { toolSpecificField: 'tool-specific-value' });

      ResourceMetadataContext.of(res).add({ why: 'routes events to external storage' });

      const template = toCloudFormation(stack);
      expect(template.Resources.Res.Metadata['com.example.ToolMetadata']).toEqual({
        toolSpecificField: 'tool-specific-value',
      });
      expect(template.Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toBeDefined();
    });

    test('no namespaced Context metadata emitted for resources with no applicable context', () => {
      const stack = new Stack();
      const withContext = new CfnResource(stack, 'A', { type: 'AWS::Fake::Thing' });
      new CfnResource(stack, 'B', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(withContext).add({ why: 'has context' });

      const template = toCloudFormation(stack);
      expect(template.Resources.A.Metadata[CONTEXT_METADATA_KEY]).toBeDefined();
      expect(template.Resources.B.Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });
  });

  describe('resource-level validation', () => {
    test('an empty context block is a harmless no-op', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      expect(() => ResourceMetadataContext.of(res).add({})).not.toThrow();
      expect(() => ResourceMetadataContext.of(res).add({ must: [] })).not.toThrow();

      expect(toCloudFormation(stack).Resources.Res.Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('trust-only block synthesizes', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(res).add({
        trust: {
          source: ContextTrustSource.AUTHORED,
          confidence: ContextTrustConfidence.HIGH,
        },
      });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        trust: { src: 'authored', conf: 'high' },
      });
    });

    test('deps-only block synthesizes', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(res).add({ deps: ['NetworkStack'] });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        deps: ['NetworkStack'],
      });
    });

    test('why is optional and merges from an applicable ancestor declaration', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(scope).add({ why: 'processes order events' }, { applyToDescendants: true });
      ResourceMetadataContext.of(res).add({ deps: ['check queue depth'] });

      expect(toCloudFormation(stack).Resources[stack.getLogicalId(res)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'processes order events',
        deps: ['check queue depth'],
      });
    });

    test('allows trust when accompanied by why', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(res).add({
        why: 'processes order events',
        trust: {
          source: ContextTrustSource.AUTHORED,
          confidence: ContextTrustConfidence.HIGH,
        },
      });

      expect(() => synthesize(stack)).not.toThrow();
    });

    test('blank list entries are structurally valid and synthesize', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(res).add({ must: ['  '] });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({ must: ['  '] });
    });

    test('a blank why is structurally valid and synthesizes', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(res).add({ why: '  ' });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({ why: '  ' });
    });

    test('throws when trust is provided without a source', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      const trust = { confidence: ContextTrustConfidence.HIGH } as any;

      expect(() => ResourceMetadataContext.of(res).add({ why: 'x', trust })).toThrow(/trust requires a 'source'/);
    });

    test('throws when trust is provided without a confidence', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      const trust = { source: ContextTrustSource.AUTHORED } as any;

      expect(() => ResourceMetadataContext.of(res).add({ why: 'x', trust })).toThrow(/trust requires a 'confidence'/);
    });

    test('blank trust citation or note is structurally valid and synthesizes', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(res).add({
        why: 'x',
        trust: { source: ContextTrustSource.AUTHORED, confidence: ContextTrustConfidence.HIGH, citation: '  ', note: '  ' },
      });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY].trust).toEqual({
        src: 'authored',
        conf: 'high',
        cite: '  ',
        note: '  ',
      });
    });

    test.each([
      ContextMutability.MUST_NEVER_CHANGE,
      ContextMutability.CHANGE_WITH_CONSTRAINTS,
    ])('constrained defaultMutability %s without a must rule synthesizes (recommendation not enforced)', mutability => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(res).add({
        why: 'processes order events',
        defaultMutability: mutability,
      });

      expect(() => synthesize(stack)).not.toThrow();
    });

    test.each([
      ContextMutability.MUST_NEVER_CHANGE,
      ContextMutability.CHANGE_WITH_CONSTRAINTS,
    ])('constrained propertyMutability %s without a must rule synthesizes (recommendation not enforced)', mutability => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(res).add({
        why: 'processes order events',
        propertyMutability: { Name: mutability },
      });

      expect(() => synthesize(stack)).not.toThrow();
    });

    test('allows constrained mutability with a non-empty must rule', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(res).add({
        why: 'processes order events',
        must: ['Name must not change because replacement loses the external reference'],
        defaultMutability: ContextMutability.CHANGE_WITH_CONSTRAINTS,
        propertyMutability: { Name: ContextMutability.MUST_NEVER_CHANGE },
      });

      expect(() => synthesize(stack)).not.toThrow();
    });

    test('constrained mutability can use an inherited must rule', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(scope).add({
        why: 'processes order events',
        must: ['VisibilityTimeout must preserve the retry timing relationship'],
      }, { applyToDescendants: true });
      ResourceMetadataContext.of(res).add({
        propertyMutability: { VisibilityTimeout: ContextMutability.CHANGE_WITH_CONSTRAINTS },
      });

      expect(() => synthesize(stack)).not.toThrow();
    });

    test('throws when a propertyMutability entry repeats defaultMutability', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      expect(() => ResourceMetadataContext.of(res).add({
        defaultMutability: ContextMutability.FREE_TO_TUNE,
        propertyMutability: { Name: ContextMutability.FREE_TO_TUNE },
      })).toThrow(/must not repeat defaultMutability/);
    });

    test('allows propertyMutability entries that deviate from defaultMutability', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      expect(() => ResourceMetadataContext.of(res).add({
        why: 'processes order events',
        must: ['Name must not change because replacement loses the external reference'],
        defaultMutability: ContextMutability.FREE_TO_TUNE,
        propertyMutability: { Name: ContextMutability.MUST_NEVER_CHANGE },
      })).not.toThrow();
    });

    test('allows propertyMutability without a defaultMutability', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      expect(() => ResourceMetadataContext.of(res).add({
        why: 'processes order events',
        propertyMutability: { Name: ContextMutability.FREE_TO_TUNE },
      })).not.toThrow();
    });
  });

  describe('template-level context', () => {
    test('renders a top-level namespaced Context metadata block', () => {
      const stack = new Stack();

      TemplateMetadataContext.of(stack).add({
        arch: 'SQS buffer -> Lambda -> DynamoDB; DLQ for poison msgs',
        must: ['all data encrypted w/ security-team CMK'],
        owner: 'order-processing-team',
      });

      const template = toCloudFormation(stack);
      expect(template.Metadata[CONTEXT_METADATA_KEY]).toMatchObject({
        arch: 'SQS buffer -> Lambda -> DynamoDB; DLQ for poison msgs',
        must: ['all data encrypted w/ security-team CMK'],
        owner: 'order-processing-team',
      });
    });

    test('allows template context without must', () => {
      const archStack = new Stack();
      const ownerStack = new Stack();

      expect(() => TemplateMetadataContext.of(archStack).add({ arch: 'queue to function to database' })).not.toThrow();
      expect(() => TemplateMetadataContext.of(ownerStack).add({ owner: 'order-processing-team' })).not.toThrow();
    });

    test('refs render bare-string form when only a relative path is given', () => {
      const stack = new Stack();

      TemplateMetadataContext.of(stack).add({
        refs: [
          { at: 'docs/network-context.yaml' },
          { at: 'docs/encryption-context.yaml', has: 'organization encryption and tagging rules', scope: 'shared' },
        ],
      });

      const template = toCloudFormation(stack);
      expect(template.Metadata[CONTEXT_METADATA_KEY].ref).toEqual([
        'docs/network-context.yaml',
        { at: 'docs/encryption-context.yaml', has: 'organization encryption and tagging rules', scope: 'shared' },
      ]);
    });

    test('multiple add() calls merge (scalars win, lists accumulate)', () => {
      const stack = new Stack();

      TemplateMetadataContext.of(stack).add({ arch: 'first arch', must: ['rule 1'] });
      TemplateMetadataContext.of(stack).add({ arch: 'second arch', must: ['rule 2'], owner: 'platform-team' });

      const template = toCloudFormation(stack);
      expect(template.Metadata[CONTEXT_METADATA_KEY]).toMatchObject({
        arch: 'second arch',
        must: ['rule 1', 'rule 2'],
        owner: 'platform-team',
      });
    });

    test('of(Stack.of(scope)) targets the enclosing stack from a nested scope', () => {
      const app = new App();
      const stack = new Stack(app, 'MyStack');
      const scope = new Construct(stack, 'Nested');
      new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      TemplateMetadataContext.of(Stack.of(scope)).add({ arch: 'nested-declared arch' });

      const template = toCloudFormation(stack);
      expect(template.Metadata[CONTEXT_METADATA_KEY].arch).toEqual('nested-declared arch');
    });

    test('inside a NestedStack targets the nested stack template, not the parent', () => {
      const app = new App();
      const parent = new Stack(app, 'ParentStack');
      const nested = new NestedStack(parent, 'Child');
      new CfnResource(nested, 'Res', { type: 'AWS::Fake::Thing' });

      TemplateMetadataContext.of(nested).add({ arch: 'child-stack arch' });
      ResourceMetadataContext.of(nested).add({ why: 'nested resource rationale' }, { applyToDescendants: true });

      const assembly = app.synth();
      const parentTemplate = assembly.getStackByName(parent.stackName).template;
      // The nested stack's template is written as a separate cloud-assembly file
      const nestedTemplate = JSON.parse(
        fs.readFileSync(path.join(assembly.directory, nested.templateFile), 'utf-8'),
      );

      expect(nestedTemplate.Metadata[CONTEXT_METADATA_KEY]).toMatchObject({ arch: 'child-stack arch' });
      expect(nestedTemplate.Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toMatchObject({ why: 'nested resource rationale' });
      expect(parentTemplate.Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('applyToDescendants on the parent stack cascades into nested stack resources', () => {
      const app = new App();
      const parent = new Stack(app, 'ParentStack');
      const nested = new NestedStack(parent, 'Child');
      new CfnResource(nested, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(parent).add({
        why: 'resource belongs to the encrypted application stack',
        must: ['all data encrypted w/ CMK'],
      }, { applyToDescendants: true });

      const assembly = app.synth();
      const nestedTemplate = JSON.parse(
        fs.readFileSync(path.join(assembly.directory, nested.templateFile), 'utf-8'),
      );

      expect(nestedTemplate.Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toMatchObject({
        must: ['all data encrypted w/ CMK'],
      });
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

      TemplateMetadataContext.of(stack).add({ arch: 'the arch' });

      const template = toCloudFormation(stack);
      expect(template.Metadata.SomeOtherKey).toEqual('value');
      expect(template.Metadata[CONTEXT_METADATA_KEY].arch).toEqual('the arch');
    });

    test('an empty template context is a harmless no-op', () => {
      const stack = new Stack();

      expect(() => TemplateMetadataContext.of(stack).add({})).not.toThrow();
      expect(toCloudFormation(stack).Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('a blank ref at path is structurally valid and synthesizes', () => {
      const stack = new Stack();
      TemplateMetadataContext.of(stack).add({ refs: [{ at: ' ' }] });

      expect(toCloudFormation(stack).Metadata[CONTEXT_METADATA_KEY].ref).toEqual([' ']);
    });

    test('throws when a ref is missing its at path', () => {
      const stack = new Stack();

      expect(() => TemplateMetadataContext.of(stack).add({ refs: [{ has: 'no at here' } as any] })).toThrow(UnscopedValidationError);
      expect(() => TemplateMetadataContext.of(stack).add({ refs: [{ has: 'no at here' } as any] })).toThrow(/refs require an 'at' path/);
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
      TemplateMetadataContext.of(stack).add({ refs: [{ at }] });

      const template = toCloudFormation(stack);
      expect(template.Metadata[CONTEXT_METADATA_KEY].ref).toEqual([at]);
    });
  });

  describe('collision detection', () => {
    test('resource-level API context colliding with a manual Context block throws at synthesis', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      res.addMetadata(CONTEXT_METADATA_KEY, { why: 'manual user value', must: ['manual user rule'] });

      ResourceMetadataContext.of(res).add({ why: 'managed rationale' });

      expect(() => toCloudFormation(stack)).toThrow(/both a manually added/);
    });

    test('template-level API context colliding with a manual Context block throws at synthesis', () => {
      const stack = new Stack();
      stack.addMetadata(CONTEXT_METADATA_KEY, { arch: 'manual user value', must: ['manual user rule'] });

      TemplateMetadataContext.of(stack).add({ arch: 'managed architecture' });

      expect(() => toCloudFormation(stack)).toThrow(/both a manually added/);
    });
  });

  describe('schema conformance', () => {
    test('emitted resource block uses only advisory schema fields', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      ResourceMetadataContext.of(res).add({
        why: 'w',
        must: ['m'],
        defaultMutability: ContextMutability.FREE_TO_TUNE,
        propertyMutability: { Prop: ContextMutability.REVIEW_REQUIRED },
        trust: { source: ContextTrustSource.AUTHORED, confidence: ContextTrustConfidence.HIGH },
        deps: ['d'],
      });

      const template = toCloudFormation(stack);
      const context = template.Resources.Res.Metadata[CONTEXT_METADATA_KEY];
      const resourceFields = ['why', 'must', 'mutable', 'mutability', 'trust', 'deps'];
      expect(Object.keys(context).sort()).toEqual([...resourceFields].sort());
      // Enum values are frozen advisory-schema tokens
      expect(context.mutable).toEqual('free-to-tune');
      expect(context.mutability.Prop).toEqual('review-required');
      expect(context.trust).toEqual({ src: 'authored', conf: 'high' });
    });

    test('emitted template block uses only advisory schema fields', () => {
      const stack = new Stack();

      TemplateMetadataContext.of(stack).add({
        arch: 'a',
        must: ['m'],
        refs: [{ at: 'docs/context.yaml' }],
        owner: 'o',
      });

      const template = toCloudFormation(stack);
      expect(Object.keys(template.Metadata[CONTEXT_METADATA_KEY]).sort()).toEqual(['arch', 'must', 'owner', 'ref']);
    });

    test('enum wire values match the advisory schema vocabulary', () => {
      // Drift check per the schema's consumer-update strategy: these string
      // values are FROZEN for the advisory schema. If this test fails, the emitted
      // wire format no longer matches the schema.
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
