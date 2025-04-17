import { Construct } from 'constructs';
import { getWarnings } from './util';
import { App, CfnResource, Stack } from '../lib';
import { synthesize } from '../lib/private/synthesis';
import { RemovalPolicies, MissingRemovalPolicies } from '../lib/removal-policies';
import { RemovalPolicy } from '../lib/removal-policy';

class TestResource extends CfnResource {
  public static readonly CFN_RESOURCE_TYPE_NAME = 'AWS::Test::Resource';

  constructor(scope: Construct, id: string) {
    super(scope, id, {
      type: TestResource.CFN_RESOURCE_TYPE_NAME,
    });
  }
}

class TestBucketResource extends CfnResource {
  public static readonly CFN_RESOURCE_TYPE_NAME = 'AWS::S3::Bucket';

  constructor(scope: Construct, id: string) {
    super(scope, id, {
      type: TestBucketResource.CFN_RESOURCE_TYPE_NAME,
    });
  }
}

class TestTableResource extends CfnResource {
  public static readonly CFN_RESOURCE_TYPE_NAME = 'AWS::DynamoDB::Table';

  constructor(scope: Construct, id: string) {
    super(scope, id, {
      type: TestTableResource.CFN_RESOURCE_TYPE_NAME,
    });
  }
}

describe('removal-policies', () => {
  test('applies removal policy to all resources in scope', () => {
    // GIVEN
    const stack = new Stack();
    const parent = new Construct(stack, 'Parent');
    const resource1 = new TestResource(parent, 'Resource1');
    const resource2 = new TestResource(parent, 'Resource2');

    // WHEN
    RemovalPolicies.of(parent).destroy();

    // THEN
    synthesize(stack);
    expect(resource1.cfnOptions.deletionPolicy).toBe('Delete');
    expect(resource2.cfnOptions.deletionPolicy).toBe('Delete');
  });

  test('applies removal policy only to specified resource types', () => {
    // GIVEN
    const stack = new Stack();
    const parent = new Construct(stack, 'Parent');
    const bucket = new TestBucketResource(parent, 'Bucket');
    const table = new TestTableResource(parent, 'Table');
    const resource = new TestResource(parent, 'Resource');

    // WHEN
    RemovalPolicies.of(parent).retain({
      applyToResourceTypes: [
        bucket.cfnResourceType, // 'AWS::S3::Bucket'
        TestTableResource.CFN_RESOURCE_TYPE_NAME, // 'AWS::DynamoDB::Table'
      ],
    });

    // THEN
    synthesize(stack);
    expect(bucket.cfnOptions.deletionPolicy).toBe('Retain');
    expect(table.cfnOptions.deletionPolicy).toBe('Retain');
    expect(resource.cfnOptions.deletionPolicy).toBeUndefined();
  });

  test('excludes specified resource types', () => {
    // GIVEN
    const stack = new Stack();
    const parent = new Construct(stack, 'Parent');
    const bucket = new TestBucketResource(parent, 'Bucket');
    const table = new TestTableResource(parent, 'Table');
    const resource = new TestResource(parent, 'Resource');

    // WHEN
    RemovalPolicies.of(parent).snapshot({
      excludeResourceTypes: [
        TestResource.CFN_RESOURCE_TYPE_NAME, // 'AWS::Test::Resource'
      ],
    });

    // THEN
    synthesize(stack);
    expect(bucket.cfnOptions.deletionPolicy).toBe('Snapshot');
    expect(table.cfnOptions.deletionPolicy).toBe('Snapshot');
    expect(resource.cfnOptions.deletionPolicy).toBeUndefined();
  });

  test('applies different removal policies', () => {
    // GIVEN
    const stack = new Stack();
    const destroy = new TestResource(stack, 'DestroyResource');
    const retain = new TestResource(stack, 'RetainResource');
    const snapshot = new TestResource(stack, 'SnapshotResource');
    const retainOnUpdate = new TestResource(stack, 'RetainOnUpdateResource');

    // WHEN
    RemovalPolicies.of(destroy).destroy();
    RemovalPolicies.of(retain).retain();
    RemovalPolicies.of(snapshot).snapshot();
    RemovalPolicies.of(retainOnUpdate).retainOnUpdateOrDelete();

    // THEN
    synthesize(stack);
    expect(destroy.cfnOptions.deletionPolicy).toBe('Delete');
    expect(retain.cfnOptions.deletionPolicy).toBe('Retain');
    expect(snapshot.cfnOptions.deletionPolicy).toBe('Snapshot');
    expect(retainOnUpdate.cfnOptions.deletionPolicy).toBe('RetainExceptOnCreate');
  });

  test('RemovalPolicies overrides existing policies by default', () => {
    // GIVEN
    const stack = new Stack();
    const resource = new TestResource(stack, 'Resource');

    // WHEN
    RemovalPolicies.of(resource).destroy();
    synthesize(stack);
    expect(resource.cfnOptions.deletionPolicy).toBe('Delete');

    RemovalPolicies.of(resource).retain();
    synthesize(stack);
    expect(resource.cfnOptions.deletionPolicy).toBe('Retain');

    RemovalPolicies.of(resource).snapshot();
    synthesize(stack);
    expect(resource.cfnOptions.deletionPolicy).toBe('Snapshot');
  });

  test('child scope can override parent scope removal policy by default', () => {
    // GIVEN
    const stack = new Stack();
    const parent = new Construct(stack, 'Parent');
    const child = new Construct(parent, 'Child');
    const parentResource = new TestResource(parent, 'ParentResource');
    const childResource = new TestResource(child, 'ChildResource');

    // WHEN
    RemovalPolicies.of(parent).destroy();
    RemovalPolicies.of(child).retain();

    // THEN
    synthesize(stack);
    expect(parentResource.cfnOptions.deletionPolicy).toBe('Delete');
    expect(childResource.cfnOptions.deletionPolicy).toBe('Retain');
  });

  test('RemovalPolicies applies policies in order, with the last one overriding previous ones regardless of priority', () => {
    // GIVEN
    const stack = new Stack();
    const resource = new TestResource(stack, 'PriorityResource');

    // WHEN - despite higher priority (10), destroy is applied first and gets overridden by retainOnUpdateOrDelete
    RemovalPolicies.of(stack).destroy({ priority: 10 });
    RemovalPolicies.of(stack).retainOnUpdateOrDelete({ priority: 250 });

    // THEN
    synthesize(stack);
    expect(resource.cfnOptions.deletionPolicy).toBe('RetainExceptOnCreate');
  });

  test('RemovalPolicies application order determines the final policy, not priority', () => {
    // GIVEN
    const stack = new Stack();
    const resource = new TestResource(stack, 'PriorityResource');

    // WHEN
    RemovalPolicies.of(stack).retainOnUpdateOrDelete({ priority: 10 });
    RemovalPolicies.of(stack).destroy({ priority: 250 });

    // THEN
    synthesize(stack);
    expect(resource.cfnOptions.deletionPolicy).toBe('Delete');
  });
});

describe('missing-removal-policies', () => {
  test('applies removal policy only to resources without existing policies', () => {
    // GIVEN
    const stack = new Stack();
    const parent = new Construct(stack, 'Parent');
    const resource1 = new TestResource(parent, 'Resource1');
    const resource2 = new TestResource(parent, 'Resource2');

    // Set a policy on resource1
    resource1.applyRemovalPolicy(RemovalPolicy.RETAIN);

    // WHEN
    MissingRemovalPolicies.of(parent).destroy();
    // THEN
    synthesize(stack);
    expect(resource1.cfnOptions.deletionPolicy).toBe('Retain'); // Unchanged
    expect(resource2.cfnOptions.deletionPolicy).toBe('Delete'); // Applied
  });

  test('applies removal policy only to specified resource types without existing policies', () => {
    // GIVEN
    const stack = new Stack();
    const parent = new Construct(stack, 'Parent');
    const bucket1 = new TestBucketResource(parent, 'Bucket1');
    const bucket2 = new TestBucketResource(parent, 'Bucket2');
    const table = new TestTableResource(parent, 'Table');

    // Set a policy on bucket1
    bucket1.applyRemovalPolicy(RemovalPolicy.RETAIN);

    // WHEN
    MissingRemovalPolicies.of(parent).snapshot({
      applyToResourceTypes: [
        TestBucketResource.CFN_RESOURCE_TYPE_NAME, // 'AWS::S3::Bucket'
      ],
    });
    // THEN
    synthesize(stack);
    expect(bucket1.cfnOptions.deletionPolicy).toBe('Retain'); // Unchanged
    expect(bucket2.cfnOptions.deletionPolicy).toBe('Snapshot'); // Applied
    expect(table.cfnOptions.deletionPolicy).toBeUndefined(); // Not applied (wrong type)
  });

  test('excludes specified resource types from missing removal policies', () => {
    // GIVEN
    const stack = new Stack();
    const parent = new Construct(stack, 'Parent');
    const bucket = new TestBucketResource(parent, 'Bucket');
    const table = new TestTableResource(parent, 'Table');
    const resource = new TestResource(parent, 'Resource');
    // WHEN
    MissingRemovalPolicies.of(parent).retain({
      excludeResourceTypes: [
        TestTableResource.CFN_RESOURCE_TYPE_NAME, // 'AWS::DynamoDB::Table'
      ],
    });

    // THEN
    synthesize(stack);
    expect(bucket.cfnOptions.deletionPolicy).toBe('Retain');
    expect(table.cfnOptions.deletionPolicy).toBeUndefined();
    expect(resource.cfnOptions.deletionPolicy).toBe('Retain');
  });

  test('applies different missing removal policies', () => {
    // GIVEN
    const stack = new Stack();
    const destroy = new TestResource(stack, 'DestroyResource');
    const retain = new TestResource(stack, 'RetainResource');
    const snapshot = new TestResource(stack, 'SnapshotResource');
    const retainOnUpdate = new TestResource(stack, 'RetainOnUpdateResource');
    // WHEN
    MissingRemovalPolicies.of(destroy).destroy();
    MissingRemovalPolicies.of(retain).retain();
    MissingRemovalPolicies.of(snapshot).snapshot();
    MissingRemovalPolicies.of(retainOnUpdate).retainOnUpdateOrDelete();

    // THEN
    synthesize(stack);
    expect(destroy.cfnOptions.deletionPolicy).toBe('Delete');
    expect(retain.cfnOptions.deletionPolicy).toBe('Retain');
    expect(snapshot.cfnOptions.deletionPolicy).toBe('Snapshot');
    expect(retainOnUpdate.cfnOptions.deletionPolicy).toBe('RetainExceptOnCreate');
  });

  test('MissingRemovalPolicies does not override existing policies', () => {
    // GIVEN
    const stack = new Stack();
    const resource = new TestResource(stack, 'Resource');
    // WHEN
    resource.applyRemovalPolicy(RemovalPolicy.RETAIN);
    synthesize(stack);
    expect(resource.cfnOptions.deletionPolicy).toBe('Retain');

    MissingRemovalPolicies.of(resource).destroy();
    synthesize(stack);
    expect(resource.cfnOptions.deletionPolicy).toBe('Retain'); // Unchanged

    MissingRemovalPolicies.of(resource).snapshot();
    synthesize(stack);
    expect(resource.cfnOptions.deletionPolicy).toBe('Retain'); // Still unchanged
  });

  test('child scope MissingRemovalPolicies does not override parent scope RemovalPolicies', () => {
    // GIVEN
    const stack = new Stack();
    const parent = new Construct(stack, 'Parent');
    const child = new Construct(parent, 'Child');
    const childResource = new TestResource(child, 'ChildResource');
    // WHEN
    RemovalPolicies.of(parent).destroy();
    MissingRemovalPolicies.of(child).retain();

    // THEN
    synthesize(stack);
    expect(childResource.cfnOptions.deletionPolicy).toBe('Delete'); // Parent policy applied
  });

  test('parent scope MissingRemovalPolicies does not override child scope RemovalPolicies', () => {
    // GIVEN
    const stack = new Stack();
    const parent = new Construct(stack, 'Parent');
    const child = new Construct(parent, 'Child');
    const childResource = new TestResource(child, 'ChildResource');
    // WHEN
    MissingRemovalPolicies.of(parent).destroy();
    RemovalPolicies.of(child).retain();

    // THEN
    synthesize(stack);
    expect(childResource.cfnOptions.deletionPolicy).toBe('Retain'); // Child policy applied
  });

  test('RemovalPolicy aspect overrides where MissingRemovalPolicy does not', () => {
    // GIVEN
    const stack = new Stack();
    const bucket = new TestBucketResource(stack, 'Bucket');
    // WHEN - this is the example from the discussion
    // const stack = new Stack(app);
    // new MyThirdPartyBucket(stack, 'Bucket');
    // RemovalPolicies.of(stack).apply(RemovalPolicy.RETAIN);
    // Simulate the bucket already having a policy (as if set by MyThirdPartyBucket)
    bucket.applyRemovalPolicy(RemovalPolicy.DESTROY);

    // Apply the policy using RemovalPolicies (overrides)
    RemovalPolicies.of(stack).retain();

    // THEN
    synthesize(stack);
    expect(bucket.cfnOptions.deletionPolicy).toBe('Retain'); // Overridden

    // WHEN - reset and try with MissingRemovalPolicies
    const stack2 = new Stack();
    const bucket2 = new TestBucketResource(stack2, 'Bucket');

    // Simulate the bucket already having a policy (as if set by MyThirdPartyBucket)
    bucket2.applyRemovalPolicy(RemovalPolicy.DESTROY);

    // Apply the policy using MissingRemovalPolicies (doesn't override)
    MissingRemovalPolicies.of(stack2).retain();

    // THEN
    synthesize(stack2);
    expect(bucket2.cfnOptions.deletionPolicy).toBe('Delete'); // Not overridden
  });
});
