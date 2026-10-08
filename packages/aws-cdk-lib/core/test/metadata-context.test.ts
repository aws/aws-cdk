import * as fs from 'fs';
import * as path from 'path';
import type { IConstruct } from 'constructs';
import { Construct } from 'constructs';
import type { IConstructSelector } from '../lib';
import {
  App,
  CfnResource,
  CfnContextMutability,
  CfnContextTrustConfidence,
  CfnContextTrustSource,
  ConstructSelector,
  NestedStack,
  CfnResourceMetadataContext,
  Stack,
  Stage,
  CfnTemplateMetadataContext,
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

      CfnResourceMetadataContext.of(res).add({
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

      CfnResourceMetadataContext.of(res).add({
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

      CfnResourceMetadataContext.of(res).add({ why: 'no trust recorded here', must: ['a rule'] });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'no trust recorded here',
        must: ['a rule'],
      });
    });

    test('renders explicit trust with the schema field names src/conf/cite/note', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).add({
        why: 'absorb transient processor failures without dropping orders',
        trust: {
          src: CfnContextTrustSource.INFER,
          conf: CfnContextTrustConfidence.LOW,
          cite: 'api/handler.ts:87',
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

      CfnResourceMetadataContext.of(res).add({ why: 'on the resource itself' });

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

      CfnResourceMetadataContext.of(l2).add({ why: 'buffers events' });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(primary)].Metadata[CONTEXT_METADATA_KEY]).toMatchObject({ why: 'buffers events' });
      expect(template.Resources[stack.getLogicalId(helper)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('default targeting follows a multi-hop defaultChild chain when the defaultChild is another construct', () => {
      const stack = new Stack();

      // Model an L3 whose defaultChild is an L2 (like cloudfront.experimental.EdgeFunction,
      // whose defaultChild is a lambda.Function), which in turn designates its L1.
      const l3 = new Construct(stack, 'EdgeFunction');
      const l2 = new Construct(l3, 'Fn');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::Lambda::Function' });
      const helper = new CfnResource(l2, 'ServiceRole', { type: 'AWS::IAM::Role' });
      const sibling = new CfnResource(l3, 'Version', { type: 'AWS::Lambda::Version' });
      l3.node.defaultChild = l2;

      CfnResourceMetadataContext.of(l3).add({ why: 'runs at the edge' });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(primary)].Metadata[CONTEXT_METADATA_KEY]).toEqual({ why: 'runs at the edge' });
      expect(template.Resources[stack.getLogicalId(helper)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
      expect(template.Resources[stack.getLogicalId(sibling)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('default targeting fails when the defaultChild chain ends at a construct without a defaultChild', () => {
      const stack = new Stack();

      const l3 = new Construct(stack, 'Outer');
      const middle = new Construct(l3, 'Middle');
      // Not named 'Resource' or 'Default', so `middle` designates no defaultChild.
      new CfnResource(middle, 'Thing', { type: 'AWS::Fake::Thing' });
      l3.node.defaultChild = middle;

      CfnResourceMetadataContext.of(l3).add({ why: 'dead-end chain' });

      expect(() => synthesize(stack)).toThrow(
        /resource context declaration matched no CloudFormation resources.*selector/,
      );
    });

    test('default targeting fails for an L3 that declares no defaultChild even when its children do', () => {
      const stack = new Stack();

      // Model an L3 pattern such as ApplicationLoadBalancedFargateService: several
      // L2 children, each with its own primary resource, but no defaultChild on the L3.
      const l3 = new Construct(stack, 'Service');
      const lbL2 = new Construct(l3, 'LB');
      const lb = new CfnResource(lbL2, 'Resource', { type: 'AWS::ElasticLoadBalancingV2::LoadBalancer' });
      lbL2.node.defaultChild = lb;
      const svcL2 = new Construct(l3, 'Svc');
      const svc = new CfnResource(svcL2, 'Service', { type: 'AWS::ECS::Service' });
      svcL2.node.defaultChild = svc;

      CfnResourceMetadataContext.of(l3).add({ why: 'no primary resource' });

      expect(() => synthesize(stack)).toThrow(
        /resource context declaration matched no CloudFormation resources.*selector/,
      );
    });

    test('an L3 without a defaultChild can be targeted with a resource-type selector', () => {
      const stack = new Stack();

      const l3 = new Construct(stack, 'Service');
      const lbL2 = new Construct(l3, 'LB');
      const lb = new CfnResource(lbL2, 'Resource', { type: 'AWS::ElasticLoadBalancingV2::LoadBalancer' });
      lbL2.node.defaultChild = lb;
      const lbHelper = new CfnResource(lbL2, 'SecurityGroup', { type: 'AWS::EC2::SecurityGroup' });
      const svcL2 = new Construct(l3, 'Svc');
      const svc = new CfnResource(svcL2, 'Service', { type: 'AWS::ECS::Service' });
      svcL2.node.defaultChild = svc;

      CfnResourceMetadataContext.of(l3).add({
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

    test('default targeting fails when a grouping construct has no primary resource', () => {
      const stack = new Stack();
      const group = new Construct(stack, 'SubSystem');
      new CfnResource(group, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(group).add({ why: 'grouping rationale' });

      expect(() => synthesize(stack)).toThrow(
        /resource context declaration matched no CloudFormation resources.*selector/,
      );
    });

    test('default targeting fails from a Stack scope', () => {
      const stack = new Stack();
      // `Resource` is a special defaultChild id in constructs; Stack remains
      // a structural boundary even when a direct child has that id.
      new CfnResource(stack, 'Resource', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(stack).add({ why: 'stack-wide but narrow by default' });

      expect(() => synthesize(stack)).toThrow(
        /resource context declaration matched no CloudFormation resources.*selector/,
      );
    });

    test('ConstructSelector.all() reaches every resource beneath a grouping construct, helpers included', () => {
      const stack = new Stack();

      const group = new Construct(stack, 'SubSystem');
      const l2 = new Construct(group, 'Topic');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::SNS::Topic' });
      l2.node.defaultChild = primary;
      const helper = new CfnResource(l2, 'Policy', { type: 'AWS::SNS::TopicPolicy' });

      CfnResourceMetadataContext.of(group).add({ deps: ['AlertingStack'] }, { selector: ConstructSelector.all() });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(primary)].Metadata[CONTEXT_METADATA_KEY]).toEqual({ deps: ['AlertingStack'] });
      expect(template.Resources[stack.getLogicalId(helper)].Metadata[CONTEXT_METADATA_KEY]).toEqual({ deps: ['AlertingStack'] });
    });

    test('a selector that does not match the primary resource reaches only the helper resources of an L2', () => {
      const stack = new Stack();

      const l2 = new Construct(stack, 'Fn');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::Lambda::Function' });
      l2.node.defaultChild = primary;
      const role = new CfnResource(l2, 'ServiceRole', { type: 'AWS::IAM::Role' });
      const logGroup = new CfnResource(l2, 'LogGroup', { type: 'AWS::Logs::LogGroup' });

      // Selecting the helper types leaves the primary resource out.
      CfnResourceMetadataContext.of(l2).add({
        why: 'supporting resource for the order processor',
      }, {
        selector: ConstructSelector.resourcesOfType('AWS::IAM::Role', 'AWS::Logs::LogGroup'),
      });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(primary)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
      for (const helper of [role, logGroup]) {
        expect(template.Resources[stack.getLogicalId(helper)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
          why: 'supporting resource for the order processor',
        });
      }
    });

    test('ConstructSelector.all() reaches resources from a stack scope', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(stack).add({ why: 'resource belongs to the networked subsystem', deps: ['NetworkStack'] }, { selector: ConstructSelector.all() });

      const template = toCloudFormation(stack);
      expect(template.Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toMatchObject({ deps: ['NetworkStack'] });
    });

    test('resource context inside a Stage matches resources in that assembly', () => {
      const app = new App();
      const stage = new Stage(app, 'Deployment');
      const stack = new Stack(stage, 'Stack');
      new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(stack).add({ why: 'stage resource' }, { selector: ConstructSelector.all() });

      expect(() => stage.synth()).not.toThrow();
    });

    test('resource context does not silently cross Stage assembly boundaries', () => {
      const app = new App();
      const stage = new Stage(app, 'Deployment');
      const stack = new Stack(stage, 'Stack');
      new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(app).add({ why: 'outside assembly' }, { selector: ConstructSelector.all() });

      expect(() => app.synth()).toThrow(
        /resource context declaration matched no CloudFormation resources.*inside each Stage/,
      );
    });

    test('an in-Stage declaration does not render context from above the Stage boundary', () => {
      const app = new App();
      const rootStack = new Stack(app, 'RootStack');
      new CfnResource(rootStack, 'RootRes', { type: 'AWS::Fake::Thing' });
      CfnResourceMetadataContext.of(app).add({ why: 'resources belong to the root assembly', must: ['root assembly rule'] }, { selector: ConstructSelector.all() });

      const stage = new Stage(app, 'Deployment');
      const stack = new Stack(stage, 'StageStack');
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      CfnResourceMetadataContext.of(stack).add({ why: 'stage resource' }, { selector: ConstructSelector.all() });

      const template = stage.synth().getStackByName(stack.stackName).template;
      expect(template.Resources[stack.getLogicalId(res)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'stage resource',
      });
    });

    test('ConstructSelector.all() on an L2 scope reaches its helper resources too', () => {
      const stack = new Stack();
      const l2 = new Construct(stack, 'MyQueue');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::SQS::Queue' });
      l2.node.defaultChild = primary;
      const helper = new CfnResource(l2, 'HelperRole', { type: 'AWS::IAM::Role' });

      CfnResourceMetadataContext.of(l2).add({ why: 'buffers events' }, { selector: ConstructSelector.all() });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(primary)].Metadata[CONTEXT_METADATA_KEY]).toMatchObject({ why: 'buffers events' });
      expect(template.Resources[stack.getLogicalId(helper)].Metadata[CONTEXT_METADATA_KEY]).toMatchObject({ why: 'buffers events' });
    });

    test('ConstructSelector.all() selects every resource under the scope, not only helpers', () => {
      const stack = new Stack();
      const l2 = new Construct(stack, 'MyQueue');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::SQS::Queue' });
      l2.node.defaultChild = primary;
      const helper = new CfnResource(l2, 'Policy', { type: 'AWS::SQS::QueuePolicy' });
      const loose = new CfnResource(stack, 'Loose', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(stack).add({ deps: ['NetworkStack'] }, { selector: ConstructSelector.all() });

      const template = toCloudFormation(stack);
      for (const resource of [primary, helper, loose]) {
        expect(template.Resources[stack.getLogicalId(resource)].Metadata[CONTEXT_METADATA_KEY]).toEqual({ deps: ['NetworkStack'] });
      }
    });

    test('ConstructSelector.resourcesOfType() reaches helpers of that type only', () => {
      const stack = new Stack();
      const l2 = new Construct(stack, 'Fn');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::Lambda::Function' });
      l2.node.defaultChild = primary;
      const role = new CfnResource(l2, 'ServiceRole', { type: 'AWS::IAM::Role' });
      const policy = new CfnResource(l2, 'ServiceRolePolicy', { type: 'AWS::IAM::Policy' });

      CfnResourceMetadataContext.of(stack).add({
        must: ['execution roles keep the org permissions boundary'],
      }, {
        selector: ConstructSelector.resourcesOfType('AWS::IAM::Role'),
      });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(role)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        must: ['execution roles keep the org permissions boundary'],
      });
      expect(template.Resources[stack.getLogicalId(primary)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
      expect(template.Resources[stack.getLogicalId(policy)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('an ambiguous defaultChild surfaces the constructs error at synthesis', () => {
      const stack = new Stack();
      const ambiguous = new Construct(stack, 'Ambiguous');
      new CfnResource(ambiguous, 'Resource', { type: 'AWS::Fake::Thing' });
      // A sibling with id "Default" makes node.defaultChild ambiguous. The
      // constructs library throws, and CDK deliberately lets that error through
      // because it names the root cause.
      new CfnResource(ambiguous, 'Default', { type: 'AWS::Fake::Other' });

      CfnResourceMetadataContext.of(ambiguous).add({ why: 'x' });

      expect(() => synthesize(stack)).toThrow(
        /Cannot determine default child for .*Ambiguous.*both a child with id "Resource" and id "Default"/,
      );
    });

    test('revalidates targets and clears stale render state on repeated synthesis', () => {
      const stack = new Stack();
      const l2 = new Construct(stack, 'MyQueue');
      const primary = new CfnResource(l2, 'Resource', { type: 'AWS::SQS::Queue' });
      const nonResource = new Construct(l2, 'NotAResource');
      l2.node.defaultChild = primary;

      CfnResourceMetadataContext.of(l2).add({ why: 'buffers events' });

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

      CfnResourceMetadataContext.of(scope).add({
        why: 'outer rationale',
        mutable: CfnContextMutability.FREE_TO_TUNE,
        must: ['outer invariant'],
      }, { selector: ConstructSelector.all() });
      CfnResourceMetadataContext.of(res).add({
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

      CfnResourceMetadataContext.of(scope).add({ why: 'shared subsystem resource', must: ['shared rule', 'outer rule'] }, { selector: ConstructSelector.all() });
      CfnResourceMetadataContext.of(res).add({ must: ['shared rule', 'inner rule'] });

      const template = toCloudFormation(stack);
      const logicalId = stack.getLogicalId(res);
      expect(template.Resources[logicalId].Metadata[CONTEXT_METADATA_KEY].must).toEqual([
        'shared rule',
        'outer rule',
        'inner rule',
      ]);
    });

    test('mutability maps merge per key with nearest-wins per property', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(scope).add({
        why: 'queue settings preserve order-processing behavior',
        must: ['VisibilityTimeout changes must preserve the retry timing relationship'],
        mutability: {
          QueueName: CfnContextMutability.REVIEW_REQUIRED,
          VisibilityTimeout: CfnContextMutability.CHANGE_WITH_CONSTRAINTS,
        },
      }, { selector: ConstructSelector.all() });
      CfnResourceMetadataContext.of(res).add({
        must: ['QueueName must not change because replacement loses the external reference'],
        mutability: { QueueName: CfnContextMutability.MUST_NEVER_CHANGE },
      });

      const template = toCloudFormation(stack);
      const logicalId = stack.getLogicalId(res);
      expect(template.Resources[logicalId].Metadata[CONTEXT_METADATA_KEY].mutability).toEqual({
        QueueName: 'must-never-change',
        VisibilityTimeout: 'change-with-constraints',
      });
    });

    test('declarations from ancestor scopes reach a resource that has its own declaration', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(scope).add({ must: ['ancestor rule'] }, { selector: ConstructSelector.all() });
      CfnResourceMetadataContext.of(res).add({ why: 'leaf rationale' });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(res)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        must: ['ancestor rule'],
        why: 'leaf rationale',
      });
    });

    test('clear() stops ancestor declarations at the cleared scope', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(scope).add({ must: ['ancestor rule'], why: 'ancestor rationale' }, { selector: ConstructSelector.all() });
      CfnResourceMetadataContext.of(res).clear();
      CfnResourceMetadataContext.of(res).add({ why: 'leaf rationale' });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(res)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'leaf rationale',
      });
    });

    test('clear() keeps declarations on the cleared scope whether added before or after it', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(scope).add({ must: ['ancestor rule'] }, { selector: ConstructSelector.all() });
      CfnResourceMetadataContext.of(res).add({ must: ['same-scope rule'] });
      CfnResourceMetadataContext.of(res).clear();
      CfnResourceMetadataContext.of(res).add({ why: 'leaf rationale' });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(res)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        must: ['same-scope rule'],
        why: 'leaf rationale',
      });
    });

    test('clear() removes every candidate beneath the cleared scope, whatever the ancestor selected', () => {
      const stack = new Stack();
      const kept = new CfnResource(stack, 'Orders', { type: 'AWS::SQS::Queue' });
      const legacy = new Construct(stack, 'Legacy');
      const legacyQueue = new CfnResource(legacy, 'Queue', { type: 'AWS::SQS::Queue' });
      const legacyTopic = new CfnResource(legacy, 'Topic', { type: 'AWS::SNS::Topic' });

      CfnResourceMetadataContext.of(stack).add({
        must: ['queues use the security team customer managed key'],
      }, { selector: ConstructSelector.resourcesOfType('AWS::SQS::Queue') });
      CfnResourceMetadataContext.of(stack).add({ deps: ['NetworkStack'] }, { selector: ConstructSelector.all() });
      CfnResourceMetadataContext.of(legacy).clear();
      CfnResourceMetadataContext.of(legacyTopic).add({ why: 'legacy notifications' });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(kept)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        must: ['queues use the security team customer managed key'],
        deps: ['NetworkStack'],
      });
      expect(template.Resources[stack.getLogicalId(legacyQueue)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
      expect(template.Resources[stack.getLogicalId(legacyTopic)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'legacy notifications',
      });
    });

    test('a declaration cleared from every resource it selects still counts as matched', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(stack).add({ why: 'stack rationale' }, { selector: ConstructSelector.all() });
      CfnResourceMetadataContext.of(res).clear();

      expect(() => synthesize(stack)).not.toThrow();
      expect(toCloudFormation(stack).Resources.Res.Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('multiple add() calls on the same scope merge', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).add({ why: 'first rationale', must: ['rule 1'] });
      CfnResourceMetadataContext.of(res).add({ why: 'second rationale', must: ['rule 2'] });

      const template = toCloudFormation(stack);
      expect(template.Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toMatchObject({
        why: 'second rationale',
        must: ['rule 1', 'rule 2'],
      });
    });

    test('mutability entries equal to the merged mutable are dropped, across scopes and on one scope', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const emptied = new CfnResource(scope, 'Emptied', { type: 'AWS::Fake::Thing' });
      const partial = new CfnResource(scope, 'Partial', { type: 'AWS::Fake::Thing' });
      const sameScope = new CfnResource(stack, 'SameScope', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(scope).add({
        mutable: CfnContextMutability.FREE_TO_TUNE,
        mutability: { QueueName: CfnContextMutability.MUST_NEVER_CHANGE },
      }, { selector: ConstructSelector.byId('Emptied') });
      CfnResourceMetadataContext.of(emptied).add({ mutable: CfnContextMutability.MUST_NEVER_CHANGE });

      CfnResourceMetadataContext.of(scope).add({ mutable: CfnContextMutability.MUST_NEVER_CHANGE }, { selector: ConstructSelector.byId('Partial') });
      CfnResourceMetadataContext.of(partial).add({
        mutability: {
          QueueName: CfnContextMutability.MUST_NEVER_CHANGE,
          VisibilityTimeout: CfnContextMutability.FREE_TO_TUNE,
        },
      });

      CfnResourceMetadataContext.of(sameScope).add({
        mutable: CfnContextMutability.FREE_TO_TUNE,
        mutability: { Name: CfnContextMutability.REVIEW_REQUIRED },
      });
      CfnResourceMetadataContext.of(sameScope).add({ mutable: CfnContextMutability.REVIEW_REQUIRED });

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(emptied)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        mutable: 'must-never-change',
      });
      expect(template.Resources[stack.getLogicalId(partial)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        mutable: 'must-never-change',
        mutability: { VisibilityTimeout: 'free-to-tune' },
      });
      expect(template.Resources.SameScope.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        mutable: 'review-required',
      });
    });

    test('resource-type selectors target only matching resources', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const queue = new CfnResource(scope, 'Queue', { type: 'AWS::SQS::Queue' });
      const topic = new CfnResource(scope, 'Topic', { type: 'AWS::SNS::Topic' });

      CfnResourceMetadataContext.of(scope).add(
        { why: 'queue-specific context' },
        { selector: ConstructSelector.resourcesOfType('AWS::SQS::Queue') },
      );
      CfnResourceMetadataContext.of(scope).add(
        { why: 'non-queue subsystem resource' },
        { selector: ConstructSelector.resourcesOfType('AWS::SNS::Topic') },
      );

      const template = toCloudFormation(stack);
      const queueId = stack.getLogicalId(queue);
      const topicId = stack.getLogicalId(topic);
      expect(template.Resources[queueId].Metadata[CONTEXT_METADATA_KEY]).toMatchObject({ why: 'queue-specific context' });
      expect(template.Resources[topicId].Metadata[CONTEXT_METADATA_KEY]).toMatchObject({ why: 'non-queue subsystem resource' });
    });

    test('the selector runs at synthesis, so it covers resources added after add()', () => {
      const stack = new Stack();

      CfnResourceMetadataContext.of(stack).add(
        { must: ['delivery settings must preserve in-flight messages'] },
        { selector: ConstructSelector.resourcesOfType('AWS::SQS::Queue') },
      );
      const queue = new CfnResource(stack, 'Queue', { type: 'AWS::SQS::Queue' });

      expect(toCloudFormation(stack).Resources[stack.getLogicalId(queue)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        must: ['delivery settings must preserve in-flight messages'],
      });
    });

    test('a selected construct contributes its primary resource', () => {
      const stack = new Stack();
      const fn = new Construct(stack, 'Fn');
      new CfnResource(fn, 'Resource', { type: 'AWS::Lambda::Function' });
      const role = new Construct(fn, 'ServiceRole');
      const cfnRole = new CfnResource(role, 'Resource', { type: 'AWS::IAM::Role' });
      const rolePolicy = new CfnResource(role, 'DefaultPolicy', { type: 'AWS::IAM::Policy' });

      CfnResourceMetadataContext.of(stack).add(
        { must: ['execution roles must keep the organization permissions boundary'] },
        { selector: ConstructSelector.byId('ServiceRole') },
      );

      const template = toCloudFormation(stack);
      expect(template.Resources[stack.getLogicalId(cfnRole)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        must: ['execution roles must keep the organization permissions boundary'],
      });
      expect(template.Resources[stack.getLogicalId(rolePolicy)].Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
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

      CfnResourceMetadataContext.of(stack).add({ why: 'custom selection' }, { selector: new SelectConstruct(res) });

      const template = toCloudFormation(stack);
      expect(template.Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({ why: 'custom selection' });
      expect(template.Resources.Other.Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('fails when a selector matches no resources', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      new CfnResource(scope, 'Topic', { type: 'AWS::SNS::Topic' });

      CfnResourceMetadataContext.of(scope).add(
        { why: 'queue-only rationale' },
        { selector: ConstructSelector.resourcesOfType('AWS::SQS::Queue') },
      );

      expect(() => synthesize(stack)).toThrow(
        /resource context declaration matched no CloudFormation resources.*adjust the selector/,
      );
    });

    test('fails when the selected constructs have no primary resource', () => {
      const stack = new Stack();
      const group = new Construct(stack, 'Group');
      new CfnResource(group, 'Queue', { type: 'AWS::SQS::Queue' });

      CfnResourceMetadataContext.of(stack).add({ why: 'grouping rationale' }, { selector: ConstructSelector.byId('Group') });

      expect(() => synthesize(stack)).toThrow(
        /resource context declaration matched no CloudFormation resources/,
      );
    });

    test('add() never throws; invalid declarations fail synthesis', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Queue', { type: 'AWS::SQS::Queue' });

      expect(() => CfnResourceMetadataContext.of(res).add({
        why: 'x',
        trust: { conf: CfnContextTrustConfidence.HIGH } as any,
      })).not.toThrow();
      expect(() => CfnResourceMetadataContext.of(stack).add({ why: 'no primary resource' })).not.toThrow();

      expect(() => synthesize(stack)).toThrow(/trust requires 'src'/);
      expect(() => synthesize(stack)).toThrow(/matched no CloudFormation resources/);
    });

    test('each declaration must independently match at least one resource', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      new CfnResource(scope, 'Queue', { type: 'AWS::SQS::Queue' });

      CfnResourceMetadataContext.of(scope).add(
        { why: 'queue rationale' },
        { selector: ConstructSelector.resourcesOfType('AWS::SQS::Queue') },
      );
      CfnResourceMetadataContext.of(scope).add(
        { why: 'topic rationale' },
        { selector: ConstructSelector.resourcesOfType('AWS::SNS::Topic') },
      );

      expect(() => synthesize(stack)).toThrow(
        /resource context declaration matched no CloudFormation resources.*adjust the selector/,
      );
    });

    test('ConstructSelector.all() fails on an empty scope', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'Empty');

      CfnResourceMetadataContext.of(scope).add({ why: 'no targets' }, { selector: ConstructSelector.all() });

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

      CfnResourceMetadataContext.of(res).add({ why: 'routes events to external storage' });

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

      CfnResourceMetadataContext.of(withContext).add({ why: 'has context' });

      const template = toCloudFormation(stack);
      expect(template.Resources.A.Metadata[CONTEXT_METADATA_KEY]).toBeDefined();
      expect(template.Resources.B.Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });
  });

  describe('resource-level validation', () => {
    test('an empty context block is a harmless no-op', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      expect(() => CfnResourceMetadataContext.of(res).add({})).not.toThrow();
      expect(() => CfnResourceMetadataContext.of(res).add({ must: [] })).not.toThrow();

      expect(toCloudFormation(stack).Resources.Res.Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('trust-only block synthesizes', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).add({
        trust: {
          src: CfnContextTrustSource.AUTHORED,
          conf: CfnContextTrustConfidence.HIGH,
        },
      });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        trust: { src: 'authored', conf: 'high' },
      });
    });

    test('deps-only block synthesizes', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).add({ deps: ['NetworkStack'] });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        deps: ['NetworkStack'],
      });
    });

    test('why is optional and merges from an applicable ancestor declaration', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(scope).add({ why: 'processes order events' }, { selector: ConstructSelector.all() });
      CfnResourceMetadataContext.of(res).add({ deps: ['check queue depth'] });

      expect(toCloudFormation(stack).Resources[stack.getLogicalId(res)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'processes order events',
        deps: ['check queue depth'],
      });
    });

    test('allows trust when accompanied by why', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).add({
        why: 'processes order events',
        trust: {
          src: CfnContextTrustSource.AUTHORED,
          conf: CfnContextTrustConfidence.HIGH,
        },
      });

      expect(() => synthesize(stack)).not.toThrow();
    });

    test('blank list entries are structurally valid and synthesize', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).add({ must: ['  '] });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({ must: ['  '] });
    });

    test('a blank why is structurally valid and synthesizes', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).add({ why: '  ' });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({ why: '  ' });
    });

    test('fails synthesis when trust is provided without src', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      const trust = { conf: CfnContextTrustConfidence.HIGH } as any;

      CfnResourceMetadataContext.of(res).add({ why: 'x', trust });

      expect(() => synthesize(stack)).toThrow(/trust requires 'src'/);
    });

    test('fails synthesis when trust is provided without conf', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      const trust = { src: CfnContextTrustSource.AUTHORED } as any;

      CfnResourceMetadataContext.of(res).add({ why: 'x', trust });

      expect(() => synthesize(stack)).toThrow(/trust requires 'conf'/);
    });

    test('blank trust cite or note is structurally valid and synthesizes', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).add({
        why: 'x',
        trust: { src: CfnContextTrustSource.AUTHORED, conf: CfnContextTrustConfidence.HIGH, cite: '  ', note: '  ' },
      });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY].trust).toEqual({
        src: 'authored',
        conf: 'high',
        cite: '  ',
        note: '  ',
      });
    });

    test.each([
      CfnContextMutability.MUST_NEVER_CHANGE,
      CfnContextMutability.CHANGE_WITH_CONSTRAINTS,
    ])('constrained mutable %s without a must rule synthesizes (recommendation not enforced)', mutability => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).add({
        why: 'processes order events',
        mutable: mutability,
      });

      expect(() => synthesize(stack)).not.toThrow();
    });

    test.each([
      CfnContextMutability.MUST_NEVER_CHANGE,
      CfnContextMutability.CHANGE_WITH_CONSTRAINTS,
    ])('constrained mutability %s without a must rule synthesizes (recommendation not enforced)', mutability => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).add({
        why: 'processes order events',
        mutability: { Name: mutability },
      });

      expect(() => synthesize(stack)).not.toThrow();
    });

    test('allows constrained mutability with a non-empty must rule', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).add({
        why: 'processes order events',
        must: ['Name must not change because replacement loses the external reference'],
        mutable: CfnContextMutability.CHANGE_WITH_CONSTRAINTS,
        mutability: { Name: CfnContextMutability.MUST_NEVER_CHANGE },
      });

      expect(() => synthesize(stack)).not.toThrow();
    });

    test('constrained mutability can use an inherited must rule', () => {
      const stack = new Stack();
      const scope = new Construct(stack, 'SubSystem');
      const res = new CfnResource(scope, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(scope).add({
        why: 'processes order events',
        must: ['VisibilityTimeout must preserve the retry timing relationship'],
      }, { selector: ConstructSelector.all() });
      CfnResourceMetadataContext.of(res).add({
        mutability: { VisibilityTimeout: CfnContextMutability.CHANGE_WITH_CONSTRAINTS },
      });

      expect(() => synthesize(stack)).not.toThrow();
    });

    test('fails synthesis when a mutability entry repeats mutable', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).add({
        mutable: CfnContextMutability.FREE_TO_TUNE,
        mutability: { Name: CfnContextMutability.FREE_TO_TUNE },
      });

      expect(() => synthesize(stack)).toThrow(/must not repeat mutable/);
    });

    test('allows mutability entries that deviate from mutable', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      expect(() => CfnResourceMetadataContext.of(res).add({
        why: 'processes order events',
        must: ['Name must not change because replacement loses the external reference'],
        mutable: CfnContextMutability.FREE_TO_TUNE,
        mutability: { Name: CfnContextMutability.MUST_NEVER_CHANGE },
      })).not.toThrow();
    });

    test('allows mutability without a mutable', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      expect(() => CfnResourceMetadataContext.of(res).add({
        why: 'processes order events',
        mutability: { Name: CfnContextMutability.FREE_TO_TUNE },
      })).not.toThrow();
    });
  });

  describe('template-level context', () => {
    test('renders a top-level namespaced Context metadata block', () => {
      const stack = new Stack();

      CfnTemplateMetadataContext.of(stack).add({
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

      expect(() => CfnTemplateMetadataContext.of(archStack).add({ arch: 'queue to function to database' })).not.toThrow();
      expect(() => CfnTemplateMetadataContext.of(ownerStack).add({ owner: 'order-processing-team' })).not.toThrow();
    });

    test('ref entries render bare-string form when only a relative path is given', () => {
      const stack = new Stack();

      CfnTemplateMetadataContext.of(stack).add({
        ref: [
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

      CfnTemplateMetadataContext.of(stack).add({ arch: 'first arch', must: ['rule 1'] });
      CfnTemplateMetadataContext.of(stack).add({ arch: 'second arch', must: ['rule 2'], owner: 'platform-team' });

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

      CfnTemplateMetadataContext.of(Stack.of(scope)).add({ arch: 'nested-declared arch' });

      const template = toCloudFormation(stack);
      expect(template.Metadata[CONTEXT_METADATA_KEY].arch).toEqual('nested-declared arch');
    });

    test('inside a NestedStack targets the nested stack template, not the parent', () => {
      const app = new App();
      const parent = new Stack(app, 'ParentStack');
      const nested = new NestedStack(parent, 'Child');
      new CfnResource(nested, 'Res', { type: 'AWS::Fake::Thing' });

      CfnTemplateMetadataContext.of(nested).add({ arch: 'child-stack arch' });
      CfnResourceMetadataContext.of(nested).add({ why: 'nested resource rationale' }, { selector: ConstructSelector.all() });

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

    test('ConstructSelector.all() on the parent stack reaches nested stack resources', () => {
      const app = new App();
      const parent = new Stack(app, 'ParentStack');
      const nested = new NestedStack(parent, 'Child');
      new CfnResource(nested, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(parent).add({
        why: 'resource belongs to the encrypted application stack',
        must: ['all data encrypted w/ CMK'],
      }, { selector: ConstructSelector.all() });

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

      CfnTemplateMetadataContext.of(stack).add({ arch: 'the arch' });

      const template = toCloudFormation(stack);
      expect(template.Metadata.SomeOtherKey).toEqual('value');
      expect(template.Metadata[CONTEXT_METADATA_KEY].arch).toEqual('the arch');
    });

    test('an empty template context is a harmless no-op', () => {
      const stack = new Stack();

      expect(() => CfnTemplateMetadataContext.of(stack).add({})).not.toThrow();
      expect(toCloudFormation(stack).Metadata?.[CONTEXT_METADATA_KEY]).toBeUndefined();
    });

    test('a blank ref at path is structurally valid and synthesizes', () => {
      const stack = new Stack();
      CfnTemplateMetadataContext.of(stack).add({ ref: [{ at: ' ' }] });

      expect(toCloudFormation(stack).Metadata[CONTEXT_METADATA_KEY].ref).toEqual([' ']);
    });

    test('throws when a ref is missing its at path', () => {
      const stack = new Stack();

      expect(() => CfnTemplateMetadataContext.of(stack).add({ ref: [{ has: 'no at here' } as any] })).toThrow(UnscopedValidationError);
      expect(() => CfnTemplateMetadataContext.of(stack).add({ ref: [{ has: 'no at here' } as any] })).toThrow(/ref entries require an 'at' path/);
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
      CfnTemplateMetadataContext.of(stack).add({ ref: [{ at }] });

      const template = toCloudFormation(stack);
      expect(template.Metadata[CONTEXT_METADATA_KEY].ref).toEqual([at]);
    });
  });

  describe('directly written context', () => {
    test('a directly written block merges as a declaration on its resource', () => {
      const stack = new Stack();
      const queue = new Construct(stack, 'Queue');
      const cfnQueue = new CfnResource(queue, 'Resource', { type: 'AWS::SQS::Queue' });
      cfnQueue.addMetadata(CONTEXT_METADATA_KEY, { why: 'written directly', must: ['written directly'] });

      CfnResourceMetadataContext.of(queue).add({
        why: 'declared through the metadata-context API',
        must: ['declared through the metadata-context API'],
      });

      expect(toCloudFormation(stack).Resources[stack.getLogicalId(cfnQueue)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'declared through the metadata-context API',
        must: ['written directly', 'declared through the metadata-context API'],
      });
    });

    test('a directly written block wins single-value fields against other ancestor scopes', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      res.addMetadata(CONTEXT_METADATA_KEY, { why: 'written directly', must: ['written directly'], extra: 'kept' });

      CfnResourceMetadataContext.of(stack).add({
        why: 'stack rationale',
        must: ['stack rule'],
      }, { selector: ConstructSelector.all() });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        why: 'written directly',
        must: ['stack rule', 'written directly'],
        extra: 'kept',
      });
    });

    test('a directly written block is kept when its own construct is cleared', () => {
      const stack = new Stack();
      const queue = new Construct(stack, 'Queue');
      const cfnQueue = new CfnResource(queue, 'Resource', { type: 'AWS::SQS::Queue' });
      cfnQueue.addMetadata(CONTEXT_METADATA_KEY, { must: ['written directly'] });

      CfnResourceMetadataContext.of(stack).add({ must: ['stack rule'] }, { selector: ConstructSelector.all() });
      CfnResourceMetadataContext.of(queue).clear();
      CfnResourceMetadataContext.of(queue).add({ why: 'declared on the queue' });

      expect(toCloudFormation(stack).Resources[stack.getLogicalId(cfnQueue)].Metadata[CONTEXT_METADATA_KEY]).toEqual({
        must: ['written directly'],
        why: 'declared on the queue',
      });
    });

    test('mutability entries written directly are dropped when they equal the merged mutable', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      res.addMetadata(CONTEXT_METADATA_KEY, { mutability: { Name: 'free-to-tune', Arn: 'must-never-change' } });

      CfnResourceMetadataContext.of(res).add({ mutable: CfnContextMutability.FREE_TO_TUNE });

      expect(toCloudFormation(stack).Resources.Res.Metadata[CONTEXT_METADATA_KEY]).toEqual({
        mutability: { Arn: 'must-never-change' },
        mutable: 'free-to-tune',
      });
    });

    test('a directly written value that is not an object fails synthesis when the API also targets the resource', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });
      res.addMetadata(CONTEXT_METADATA_KEY, 'not a context block');

      CfnResourceMetadataContext.of(res).add({ why: 'declared through the metadata-context API' });

      expect(() => toCloudFormation(stack)).toThrow(/is not an object and cannot be merged/);
    });

    test('template-level API context colliding with a manual Context block throws at synthesis', () => {
      const stack = new Stack();
      stack.addMetadata(CONTEXT_METADATA_KEY, { arch: 'manual user value', must: ['manual user rule'] });

      CfnTemplateMetadataContext.of(stack).add({ arch: 'managed architecture' });

      expect(() => toCloudFormation(stack)).toThrow(/both a manually added/);
    });
  });

  describe('schema conformance', () => {
    test('emitted resource block uses only advisory schema fields', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Res', { type: 'AWS::Fake::Thing' });

      CfnResourceMetadataContext.of(res).add({
        why: 'w',
        must: ['m'],
        mutable: CfnContextMutability.FREE_TO_TUNE,
        mutability: { Prop: CfnContextMutability.REVIEW_REQUIRED },
        trust: { src: CfnContextTrustSource.AUTHORED, conf: CfnContextTrustConfidence.HIGH },
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

      CfnTemplateMetadataContext.of(stack).add({
        arch: 'a',
        must: ['m'],
        ref: [{ at: 'docs/context.yaml' }],
        owner: 'o',
      });

      const template = toCloudFormation(stack);
      expect(Object.keys(template.Metadata[CONTEXT_METADATA_KEY]).sort()).toEqual(['arch', 'must', 'owner', 'ref']);
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
