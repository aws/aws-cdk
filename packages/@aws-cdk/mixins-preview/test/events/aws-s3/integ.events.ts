import * as cdk from 'aws-cdk-lib/core';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { CfnRule, Rule } from 'aws-cdk-lib/aws-events';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { BucketEvents } from '../../../lib/services/aws-s3/events.generated';
import { ReadWriteType, Trail } from 'aws-cdk-lib/aws-cloudtrail';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import type { Construct } from 'constructs';

// Passing L1 & L2 Bucket to L2 Events.Rule with cloudtrail pattern
class L1L2BucketWithL2Rule extends cdk.Stack {
  public constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const l1Bucket = new s3.CfnBucket(this, 'bucket');
    const l1BucketWithEvent = BucketEvents.fromBucket(l1Bucket);

    const l2Bucket = new s3.Bucket(this, 'bucketL2');
    const l2BucketWithEvent = BucketEvents.fromBucket(l2Bucket);

    const fn = new Function(this, 'MyFuncA', {
      runtime: Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: Code.fromInline(`
exports.handler = async (event) => {
  console.log("New Project event:", JSON.stringify(event, null, 2));
  return {};
};
`),
    });

    const trail = new Trail(this, 'Trail', {});
    trail.addS3EventSelector([{ bucket: l1Bucket }], { readWriteType: ReadWriteType.ALL });
    trail.addS3EventSelector([{ bucket: l2Bucket }], { readWriteType: ReadWriteType.ALL });
    const l2Rule = new Rule(this, 'L2RuleForL1', {
      targets: [new LambdaFunction(fn)],
    });

    l2Rule.addEventPattern(l1BucketWithEvent.awsAPICallViaCloudTrailPattern({ tlsDetails: { tlsVersion: ['TLSv1.3'] }, eventMetadata: { region: ['us-east-1'] } }));
    l2Rule.addEventPattern(l2BucketWithEvent.awsAPICallViaCloudTrailPattern());
  }
}

// Passing L1 Bucket to L1 Events.Rule with cloudtrail pattern
class L1BucketWithL1Rule extends cdk.Stack {
  public constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const l1Bucket = new s3.CfnBucket(this, 'bucket');
    const l1BucketWithEvent = BucketEvents.fromBucket(l1Bucket);

    const trail = new Trail(this, 'Trail', {});
    trail.addS3EventSelector([{ bucket: l1Bucket }], { readWriteType: ReadWriteType.ALL });

    const fn1 = new Function(this, 'MyFuncB', {
      runtime: Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: Code.fromInline(`
exports.handler = async (event) => {
  console.log("New Project event:", JSON.stringify(event, null, 2));
  return {};
};
`),
    });
    const rule1 = new CfnRule(this, 'RuleL1BucketL1', {
      state: 'ENABLED',
      eventPattern: l1BucketWithEvent.awsAPICallViaCloudTrailPattern(),
      targets: [{ arn: fn1.functionArn, id: 'L1' }],
    });
    fn1.addPermission('L1', {
      sourceArn: rule1.attrArn,
      action: 'lambda:InvokeFunction',
      principal: new ServicePrincipal('events.amazonaws.com'),
    });
  }
}

// Passing L2 Bucket to L1 Events.Rule with cloudtrail pattern
class L2BucketWithL1Rule extends cdk.Stack {
  public constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const l2Bucket = new s3.Bucket(this, 'bucketL2');
    const l2BucketWithEvent = BucketEvents.fromBucket(l2Bucket);

    const trail = new Trail(this, 'Trail', {});
    trail.addS3EventSelector([{ bucket: l2Bucket }], { readWriteType: ReadWriteType.ALL });

    const fn2 = new Function(this, 'MyFuncC', {
      runtime: Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: Code.fromInline(`
exports.handler = async (event) => {
  console.log("New Project event:", JSON.stringify(event, null, 2));
  return {};
};
`),
    });
    const rule2 = new CfnRule(this, 'RuleL1BucketL2', {
      state: 'ENABLED',
      eventPattern: l2BucketWithEvent.awsAPICallViaCloudTrailPattern(),
      targets: [{ arn: fn2.functionArn, id: 'L2' }],
    });

    fn2.addPermission('L2', {
      sourceArn: rule2.attrArn,
      action: 'lambda:InvokeFunction',
      principal: new ServicePrincipal('events.amazonaws.com'),
    });
  }
}

// Passing L2 Bucket to L1 Events.Rule with object created/deleted pattern
class L2BucketOtherEventsWithL2Rule extends cdk.Stack {
  public constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const l2Bucket = new s3.Bucket(this, 'bucketL2', { eventBridgeEnabled: true });
    const l2BucketWithEvent = BucketEvents.fromBucket(l2Bucket);

    const fn = new Function(this, 'MyFuncA', {
      runtime: Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: Code.fromInline(`
exports.handler = async (event) => {
  console.log("New Project event:", JSON.stringify(event, null, 2));
  return {};
};
`),
    });

    const trail = new Trail(this, 'Trail', {});
    trail.addS3EventSelector([{ bucket: l2Bucket }], { readWriteType: ReadWriteType.ALL });
    const l2Rule = new Rule(this, 'L2RuleForL1', {
      targets: [new LambdaFunction(fn)],
    });

    l2Rule.addEventPattern(l2BucketWithEvent.objectCreatedPattern({ reason: ['PutObject'] }));
    l2Rule.addEventPattern(l2BucketWithEvent.objectDeletedPattern({ reason: ['DeleteObject'] }));
  }
}

const app = new cdk.App();

const testStack1 = new L1L2BucketWithL2Rule(app, 'L1L2BucketWithL2Rule', { env: { region: 'us-east-1' } });
const testStack2 = new L1BucketWithL1Rule(app, 'L1BucketWithL1Rule', { env: { region: 'us-east-1' } });
const testStack3 = new L2BucketWithL1Rule(app, 'L2BucketWithL1Rule', { env: { region: 'us-east-1' } });
const testStack4 = new L2BucketOtherEventsWithL2Rule(app, 'L2BucketOtherEventsWithL2Rule', { env: { region: 'us-east-1' } });

new integ.IntegTest(app, 'Bucket-Test', {
  testCases: [
    testStack1,
    testStack2,
    testStack3,
    testStack4,
  ],
});

