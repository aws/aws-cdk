import { Construct } from 'constructs';
import { Stack, App } from 'aws-cdk-lib/core';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import { ConstructSelector } from '../../lib/core';

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
    const bucket = new s3.CfnBucket(stack, 'Bucket');
    const logGroup = new logs.CfnLogGroup(stack, 'LogGroup');

    const selected = ConstructSelector.resourcesOfType(s3.CfnBucket).select(stack);
    expect(selected).toContain(bucket);
    expect(selected).not.toContain(logGroup);
  });

  test('resourcesOfType() selects by CloudFormation type', () => {
    const bucket = new s3.CfnBucket(stack, 'Bucket');
    const logGroup = new logs.CfnLogGroup(stack, 'LogGroup');

    const selected = ConstructSelector.resourcesOfType('AWS::S3::Bucket').select(stack);
    expect(selected).toContain(bucket);
    expect(selected).not.toContain(logGroup);
  });

  test('byId() selects by ID pattern', () => {
    const prodBucket = new s3.CfnBucket(stack, 'prod-bucket');
    const devBucket = new s3.CfnBucket(stack, 'dev-bucket');

    const selected = ConstructSelector.byId(/prod-.*/).select(stack);
    expect(selected).toContain(prodBucket);
    expect(selected).not.toContain(devBucket);
  });

  test('cfnResource() selects CfnResource or default child', () => {
    const bucket = new s3.CfnBucket(stack, 'Bucket');
    const l2Bucket = new s3.Bucket(stack, 'L2Bucket');

    const selectedFromCfn = ConstructSelector.cfnResource().select(bucket);
    expect(selectedFromCfn).toContain(bucket);

    const selectedFromL2 = ConstructSelector.cfnResource().select(l2Bucket);
    expect(selectedFromL2.length).toBeGreaterThan(0);
  });
});
