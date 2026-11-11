import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as config from 'aws-cdk-lib/aws-config';
import { STANDARD_NODEJS_RUNTIME } from '../../config';
import { ConfigPrerequisites } from './config-test-helpers';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-config-rule');

const prerequisites = new ConfigPrerequisites(stack, 'ConfigPrerequisites', {
  resourceTypes: ['AWS::CloudFormation::Stack', 'AWS::EC2::Instance'],
});

// A custom rule that runs on configuration changes of EC2 instances
const fn = new lambda.Function(stack, 'CustomFunction', {
  code: lambda.AssetCode.fromInline('exports.handler = (event) => console.log(event);'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});

const customRule = new config.CustomRule(stack, 'Custom', {
  configurationChanges: true,
  lambdaFunction: fn,
  ruleScope: config.RuleScope.fromResources([config.ResourceType.EC2_INSTANCE]),
});
customRule.node.addDependency(prerequisites.recorder);
customRule.node.addDependency(prerequisites.deliveryChannel);

// A rule to detect stacks drifts
const driftRule = new config.CloudFormationStackDriftDetectionCheck(stack, 'Drift');
driftRule.node.addDependency(prerequisites.recorder);
driftRule.node.addDependency(prerequisites.deliveryChannel);

// Topic for compliance events
const complianceTopic = new sns.Topic(stack, 'ComplianceTopic');

// Send notification on compliance change
driftRule.onComplianceChange('ComplianceChange', {
  target: new targets.SnsTopic(complianceTopic),
});

new integ.IntegTest(app, 'aws-cdk-config-rule-integ', {
  testCases: [stack],
});
