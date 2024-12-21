import { Construct } from 'constructs';
import { CfnResource, CfnDeletionPolicy, Stack } from '../lib';
import { synthesize } from '../lib/private/synthesis';
import { RemovalPolicys } from '../lib/removal-policys';

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

describe('removal-policys', () => {
  test('applies removal policy to all resources in scope', () => {
    // GIVEN
    const stack = new Stack();
    const parent = new Construct(stack, 'Parent');
    const resource1 = new TestResource(parent, 'Resource1');
    const resource2 = new TestResource(parent, 'Resource2');

    // WHEN
    RemovalPolicys.of(parent).destroy();

    // THEN
    synthesize(stack);
    expect(resource1.cfnOptions.deletionPolicy).toBe('Delete');
    expect(resource2.cfnOptions.deletionPolicy).toBe('Delete');
  });

  test('applies removal policy only to specified resource types using strings', () => {
    // GIVEN
    const stack = new Stack();
    const parent = new Construct(stack, 'Parent');
    const bucket = new TestBucketResource(parent, 'Bucket');
    const table = new TestTableResource(parent, 'Table');
    const resource = new TestResource(parent, 'Resource');

    // WHEN
    RemovalPolicys.of(parent).retain({
      applyToResourceTypes: ['AWS::S3::Bucket', 'AWS::DynamoDB::Table'],
    });

    // THEN
    synthesize(stack);
    expect(bucket.cfnOptions.deletionPolicy).toBe('Retain');
    expect(table.cfnOptions.deletionPolicy).toBe('Retain');
    expect(resource.cfnOptions.deletionPolicy).toBeUndefined();
  });

  test('applies removal policy only to specified resource types using classes', () => {
    // GIVEN
    const stack = new Stack();
    const parent = new Construct(stack, 'Parent');
    const bucket = new TestBucketResource(parent, 'Bucket');
    const table = new TestTableResource(parent, 'Table');
    const resource = new TestResource(parent, 'Resource');

    // WHEN
    RemovalPolicys.of(parent).retain({
      applyToResourceTypes: [TestBucketResource, TestTableResource],
    });

    // THEN
    synthesize(stack);
    expect(bucket.cfnOptions.deletionPolicy).toBe('Retain');
    expect(table.cfnOptions.deletionPolicy).toBe('Retain');
    expect(resource.cfnOptions.deletionPolicy).toBeUndefined();
  });

  test('excludes specified resource types using strings', () => {
    // GIVEN
    const stack = new Stack();
    const parent = new Construct(stack, 'Parent');
    const bucket = new TestBucketResource(parent, 'Bucket');
    const table = new TestTableResource(parent, 'Table');
    const resource = new TestResource(parent, 'Resource');

    // WHEN
    RemovalPolicys.of(parent).snapshot({
      excludeResourceTypes: ['AWS::Test::Resource'],
    });

    // THEN
    synthesize(stack);
    expect(bucket.cfnOptions.deletionPolicy).toBe('Snapshot');
    expect(table.cfnOptions.deletionPolicy).toBe('Snapshot');
    expect(resource.cfnOptions.deletionPolicy).toBeUndefined();
  });

  test('excludes specified resource types using classes', () => {
    // GIVEN
    const stack = new Stack();
    const parent = new Construct(stack, 'Parent');
    const bucket = new TestBucketResource(parent, 'Bucket');
    const table = new TestTableResource(parent, 'Table');
    const resource = new TestResource(parent, 'Resource');

    // WHEN
    RemovalPolicys.of(parent).snapshot({
      excludeResourceTypes: [TestResource],
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
    RemovalPolicys.of(destroy).destroy();
    RemovalPolicys.of(retain).retain();
    RemovalPolicys.of(snapshot).snapshot();
    RemovalPolicys.of(retainOnUpdate).retainOnUpdateOrDelete();

    // THEN
    synthesize(stack);
    expect(destroy.cfnOptions.deletionPolicy).toBe('Delete');
    expect(retain.cfnOptions.deletionPolicy).toBe('Retain');
    expect(snapshot.cfnOptions.deletionPolicy).toBe('Snapshot');
    expect(retainOnUpdate.cfnOptions.deletionPolicy).toBe('RetainExceptOnCreate');
  });

  test('last applied removal policy takes precedence', () => {
    // GIVEN
    const stack = new Stack();
    const resource = new TestResource(stack, 'Resource');

    // WHEN
    RemovalPolicys.of(resource).destroy();
    synthesize(stack);
    expect(resource.cfnOptions.deletionPolicy).toBe('Delete');

    RemovalPolicys.of(resource).retain();
    synthesize(stack);
    expect(resource.cfnOptions.deletionPolicy).toBe('Delete');

    RemovalPolicys.of(resource).snapshot({ overwrite: true });
    synthesize(stack);
    expect(resource.cfnOptions.deletionPolicy).toBe('Snapshot');
  });

  test('child scope can override parent scope removal policy', () => {
    // GIVEN
    const stack = new Stack();
    const parent = new Construct(stack, 'Parent');
    const child = new Construct(parent, 'Child');
    const parentResource = new TestResource(parent, 'ParentResource');
    const childResource = new TestResource(child, 'ChildResource');

    // WHEN
    RemovalPolicys.of(parent).destroy();
    RemovalPolicys.of(child).retain();

    // THEN
    synthesize(stack);
    expect(parentResource.cfnOptions.deletionPolicy).toBe('Delete');
    expect(childResource.cfnOptions.deletionPolicy).toBe('Delete');

    RemovalPolicys.of(child).retain({ overwrite: true });
    synthesize(stack);
    expect(childResource.cfnOptions.deletionPolicy).toBe('Retain');
  });

  test('exist removalPolicy', () => {
    // GIVEN
    const stack = new Stack();
    const parent = new Construct(stack, 'Parent');
    const bucket = new TestBucketResource(parent, 'Bucket');
    bucket.cfnOptions.deletionPolicy = CfnDeletionPolicy.RETAIN;

    synthesize(stack);
    expect(bucket.cfnOptions.deletionPolicy).toBe('Retain');

    const table = new TestTableResource(parent, 'Table');
    RemovalPolicys.of(parent).retainOnUpdateOrDelete();

    synthesize(stack);
    expect(bucket.cfnOptions.deletionPolicy).toBe('Retain');
    expect(table.cfnOptions.deletionPolicy).toBe('RetainExceptOnCreate');
  });
});
