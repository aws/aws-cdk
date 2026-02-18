
import * as cdk from 'aws-cdk-lib/core';
import { Rule } from 'aws-cdk-lib/aws-events';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';
import { CfnKey, Key } from 'aws-cdk-lib/aws-kms';
import { KeyEvents } from '../../../lib/services/aws-kms/events.generated';

// Passing L1 & L2 key to L2 Events.Rule with cloudtrail pattern
class L1L2KeyWithL2Rule extends cdk.Stack {
  public constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const l1Key = new CfnKey(this, 'KeyL1', {});
    const l1KeyWithEvent = KeyEvents.fromKey(l1Key);

    const l2Key = new Key(this, 'KeyL2', {});
    const l2KeyWithEvent = KeyEvents.fromKey(l2Key);

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

    const rule = new Rule(this, 'L2RuleForL1', {
      targets: [new LambdaFunction(fn)],
    });

    rule.addEventPattern(l1KeyWithEvent.awsAPICallViaCloudTrailPattern({}));
    rule.addEventPattern(l2KeyWithEvent.awsAPICallViaCloudTrailPattern({ eventName: ['RotateKeyOnDemand'] }));
  }
}

// Passing L2 key to L2 Events.Rule with CMK Deletion/Rotation patterns
class L2KeyOtherEventsWithL2Rule extends cdk.Stack {
  public constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const l2Key = new Key(this, 'Key', {});
    const l2KeyWithEvent = KeyEvents.fromKey(l2Key);

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

    const rule = new Rule(this, 'L2RuleForL1', {
      targets: [new LambdaFunction(fn)],
    });

    rule.addEventPattern(l2KeyWithEvent.kMSCMKDeletionPattern({}));
    rule.addEventPattern(l2KeyWithEvent.kMSCMKRotationPattern({}));
  }
}

const app = new cdk.App();

const testStack1 = new L1L2KeyWithL2Rule(app, 'L1L2KeyWithL2Rule', { env: { region: 'us-east-1' } });
const testStack2 = new L2KeyOtherEventsWithL2Rule(app, 'L2KeyOtherEventsWithL2Rule', { env: { region: 'us-east-1' } });

new integ.IntegTest(app, 'Key-Test', {
  testCases: [
    testStack1,
    testStack2,
  ],
});

