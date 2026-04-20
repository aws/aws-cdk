import { Construct } from 'constructs';
import { CfnLogGroup } from '../../../aws-logs';
import { Bucket, CfnBucket } from '../../../aws-s3';
import { Stack, App } from '../../lib';
import { ConstructSelector } from '../../lib/mixins/selectors';

class TestConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

describe('ConstructSelector', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  test('all() selects all constructs', () => {
    const construct1 = new TestConstruct(stack, 'test1');
    const construct2 = new TestConstruct(stack, 'test2');

    const selected = ConstructSelector.all().select(stack);
    expect(selected).toContain(stack);
    expect(selected).toContain(construct1);
    expect(selected).toContain(construct2);
  });

  test('resourcesOfType() selects by type', () => {
    const bucket = new CfnBucket(stack, 'Bucket');
    const logGroup = new CfnLogGroup(stack, 'LogGroup');

    const selected = ConstructSelector.resourcesOfType(CfnBucket.CFN_RESOURCE_TYPE_NAME).select(stack);
    expect(selected).toContain(bucket);
    expect(selected).not.toContain(logGroup);
  });

  test('resourcesOfType() selects by CloudFormation type', () => {
    const bucket = new CfnBucket(stack, 'Bucket');
    const logGroup = new CfnLogGroup(stack, 'LogGroup');

    const selected = ConstructSelector.resourcesOfType('AWS::S3::Bucket').select(stack);
    expect(selected).toContain(bucket);
    expect(selected).not.toContain(logGroup);
  });

  test('byId() selects by ID pattern', () => {
    const prodBucket = new CfnBucket(stack, 'prod-bucket');
    const devBucket = new CfnBucket(stack, 'dev-bucket');

    const selected = ConstructSelector.byId('*prod*').select(stack);
    expect(selected).toContain(prodBucket);
    expect(selected).not.toContain(devBucket);
  });

  test('byPath() selects by construct path pattern', () => {
    const scope = new Construct(stack, 'Prefix');
    const prodBucket = new CfnBucket(scope, 'prod-bucket');
    const devBucket = new CfnBucket(stack, 'dev-bucket');

    const selected = ConstructSelector.byPath('*/Prefix/**').select(stack);
    expect(selected).toContain(prodBucket);
    expect(selected).not.toContain(devBucket);
  });

  test('cfnResource() selects CfnResource or default child', () => {
    const bucket = new CfnBucket(stack, 'Bucket');
    const l2Bucket = new Bucket(stack, 'L2Bucket');

    const selectedFromCfn = ConstructSelector.cfnResource().select(bucket);
    expect(selectedFromCfn).toContain(bucket);

    const selectedFromL2 = ConstructSelector.cfnResource().select(l2Bucket);
    expect(selectedFromL2.length).toBeGreaterThan(0);
  });

  test('onlyItself() selects only the provided construct', () => {
    const construct1 = new TestConstruct(stack, 'test1');
    new TestConstruct(construct1, 'child');

    const selected = ConstructSelector.onlyItself().select(construct1);
    expect(selected).toEqual([construct1]);
    expect(selected.length).toBe(1);
  });
});
