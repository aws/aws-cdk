import * as targets from '../../aws-events-targets';
import * as lambda from '../../aws-lambda';
import * as sns from '../../aws-sns';
import * as cdk from '../../core';
import * as integ from '../../integ-tests';
import * as config from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-config-custompolicy');

// A custom rule that runs on configuration changes of EC2 instances
const fn = new lambda.Function(stack, 'CustomFunction', {
  code: lambda.AssetCode.fromInline('exports.handler = (event) => console.log(event);'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
});

new config.CustomRule(stack, 'Custom', {
  configurationChanges: true,
  lambdaFunction: fn,
  ruleScope: config.RuleScope.fromResources([config.ResourceType.EC2_INSTANCE]),
});

// A rule to detect stacks drifts
const driftRule = new config.CloudFormationStackDriftDetectionCheck(stack, 'Drift');

// Topic for compliance events
const complianceTopic = new sns.Topic(stack, 'ComplianceTopic');

// Send notification on compliance change
driftRule.onComplianceChange('ComplianceChange', {
  target: new targets.SnsTopic(complianceTopic),
});


new integ.IntegTest(app, 'aws-cdk-config-rule-integ', {
  testCases: [stack],
});