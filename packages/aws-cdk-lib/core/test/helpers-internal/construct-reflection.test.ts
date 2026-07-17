import { Construct } from 'constructs';
import { App, CfnResource, Stack } from '../../lib';
import { ConstructReflection } from '../../lib/helpers-internal/construct-reflection';

/** Helper to create a typed CfnResource */
function cfn(scope: Construct, id: string, type: string): CfnResource {
  return new CfnResource(scope, id, { type });
}

/** Compare constructs by node path to avoid circular JSON in Jest errors */
function expectSameConstruct(actual: any, expected: any) {
  expect(actual?.node.path).toBe(expected?.node.path);
  expect(actual).toBe(expected);
}

/** Matcher that accepts any candidate of the given type */
const anyOf = (cfnResourceType: string) => ({ cfnResourceType, matches: () => true });

/** Matcher that accepts candidates by type and node id */
const byId = (cfnResourceType: string, id: string) => ({ cfnResourceType, matches: (c: CfnResource) => c.node.id === id });

describe('ConstructReflection.findRelatedCfnResource', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack(new App(), 'Stack');
  });

  test('returns undefined when no match exists', () => {
    const primary = cfn(stack, 'Primary', 'AWS::S3::Bucket');
    expect(ConstructReflection.of(primary).findRelatedCfnResource(anyOf('AWS::S3::BucketPolicy'))).toBeUndefined();
  });

  test('finds direct child', () => {
    const primary = cfn(stack, 'Primary', 'AWS::S3::Bucket');
    const child = cfn(primary, 'Child', 'AWS::S3::BucketPolicy');
    expectSameConstruct(ConstructReflection.of(primary).findRelatedCfnResource(anyOf('AWS::S3::BucketPolicy')), child);
  });

  test('finds transitive child', () => {
    const primary = cfn(stack, 'Primary', 'AWS::S3::Bucket');
    const intermediate = new Construct(primary, 'Intermediate');
    const child = cfn(intermediate, 'Child', 'AWS::S3::BucketPolicy');
    expectSameConstruct(ConstructReflection.of(primary).findRelatedCfnResource(anyOf('AWS::S3::BucketPolicy')), child);
  });

  test('finds sibling', () => {
    const parent = new Construct(stack, 'Parent');
    const primary = cfn(parent, 'Primary', 'AWS::S3::Bucket');
    const sibling = cfn(parent, 'Sibling', 'AWS::S3::BucketPolicy');
    expectSameConstruct(ConstructReflection.of(primary).findRelatedCfnResource(anyOf('AWS::S3::BucketPolicy')), sibling);
  });

  test('finds cousin via ancestor', () => {
    const grandparent = new Construct(stack, 'Grandparent');
    const parent = new Construct(grandparent, 'Parent');
    const auncle = new Construct(grandparent, 'Auncle');
    const primary = cfn(parent, 'Primary', 'AWS::S3::Bucket');
    const cousin = cfn(auncle, 'Cousin', 'AWS::S3::BucketPolicy');
    expectSameConstruct(ConstructReflection.of(primary).findRelatedCfnResource(anyOf('AWS::S3::BucketPolicy')), cousin);
  });

  test('prefers closer child over parent match', () => {
    const parent = new Construct(stack, 'Parent');
    const primary = cfn(parent, 'Primary', 'AWS::S3::Bucket');
    const child = cfn(primary, 'Child', 'AWS::S3::BucketPolicy');
    cfn(parent, 'ParentMatch', 'AWS::S3::BucketPolicy');
    expectSameConstruct(ConstructReflection.of(primary).findRelatedCfnResource(anyOf('AWS::S3::BucketPolicy')), child);
  });

  test('prefers closer ancestor match', () => {
    const grandparent = new Construct(stack, 'Grandparent');
    const parent = new Construct(grandparent, 'Parent');
    const primary = cfn(parent, 'Primary', 'AWS::S3::Bucket');
    const closer = cfn(parent, 'Closer', 'AWS::S3::BucketPolicy');
    cfn(grandparent, 'Farther', 'AWS::S3::BucketPolicy');
    expectSameConstruct(ConstructReflection.of(primary).findRelatedCfnResource(anyOf('AWS::S3::BucketPolicy')), closer);
  });

  test('ignores wrong cfn type', () => {
    const primary = cfn(stack, 'Primary', 'AWS::S3::Bucket');
    cfn(primary, 'Wrong', 'AWS::KMS::Key');
    expect(ConstructReflection.of(primary).findRelatedCfnResource(anyOf('AWS::S3::BucketPolicy'))).toBeUndefined();
  });

  test('respects matcher predicate', () => {
    const primary = cfn(stack, 'Primary', 'AWS::S3::Bucket');
    cfn(primary, 'Rejected', 'AWS::S3::BucketPolicy');
    const accepted = cfn(primary, 'Accepted', 'AWS::S3::BucketPolicy');
    expectSameConstruct(
      ConstructReflection.of(primary).findRelatedCfnResource(byId('AWS::S3::BucketPolicy', 'Accepted')),
      accepted,
    );
  });
});

describe('ConstructReflection.findCfnResource', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack(new App(), 'Stack');
  });

  test('returns construct itself if it matches', () => {
    const resource = cfn(stack, 'Resource', 'AWS::S3::Bucket');
    expectSameConstruct(ConstructReflection.of(resource).findCfnResource(anyOf('AWS::S3::Bucket')), resource);
  });

  test('returns default child if it matches', () => {
    const parent = new Construct(stack, 'Parent');
    const child = cfn(parent, 'Resource', 'AWS::S3::Bucket');
    (parent.node as any)._defaultChild = child;
    expectSameConstruct(ConstructReflection.of(parent).findCfnResource(anyOf('AWS::S3::Bucket')), child);
  });

  test('falls back to tree search', () => {
    const wrapper = new Construct(stack, 'Wrapper');
    const resource = cfn(wrapper, 'Nested', 'AWS::S3::Bucket');
    expectSameConstruct(
      ConstructReflection.of(wrapper).findCfnResource(byId('AWS::S3::Bucket', 'Nested')),
      resource,
    );
  });

  test('returns undefined when nothing matches', () => {
    const wrapper = new Construct(stack, 'Wrapper');
    expect(ConstructReflection.of(wrapper).findCfnResource(anyOf('AWS::S3::Bucket'))).toBeUndefined();
  });
});

describe('ConstructReflection.defaultChildOwner', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack(new App(), 'Stack');
  });

  test('returns parent when id is Resource', () => {
    const parent = new Construct(stack, 'Parent');
    const child = new Construct(parent, 'Resource');
    expectSameConstruct(ConstructReflection.of(child).defaultChildOwner, parent);
  });

  test('returns parent when id is Default', () => {
    const parent = new Construct(stack, 'Parent');
    const child = new Construct(parent, 'Default');
    expectSameConstruct(ConstructReflection.of(child).defaultChildOwner, parent);
  });

  test('returns undefined for other ids', () => {
    const parent = new Construct(stack, 'Parent');
    const child = new Construct(parent, 'Other');
    expect(ConstructReflection.of(child).defaultChildOwner).toBeUndefined();
  });

  test('returns undefined for root construct', () => {
    expect(ConstructReflection.of(stack).defaultChildOwner).toBeUndefined();
  });
});
