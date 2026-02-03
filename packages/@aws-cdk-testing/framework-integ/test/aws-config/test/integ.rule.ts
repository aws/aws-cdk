import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as config from 'aws-cdk-lib/aws-config';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/**********************************************************************************************************************
 *
 *    Warning! This test case can not be deployed!
 *
 *    Save yourself some time and move on.
 *    The latest given reason is:
 *    - 2023-08-30: `config.CloudFormationStackDriftDetectionCheck` fails due to missing prerequisites
 *                  Adding the required resources to the stack might fix it, @mrgrain
 *
 *********************************************************************************************************************/

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-config-custompolicy');

// A custom rule that runs on configuration changes of EC2 instances
const fn = new lambda.Function(stack, 'CustomFunction', {
  code: lambda.AssetCode.fromInline('exports.handler = (event) => console.log(event);'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
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
