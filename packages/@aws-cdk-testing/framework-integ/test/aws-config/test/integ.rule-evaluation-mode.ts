import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as config from 'aws-cdk-lib/aws-config';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'ConfigRuleEvaluationMode');

const fn = new lambda.Function(stack, 'CustomFunction', {
  code: lambda.AssetCode.fromInline('exports.handler = (event) => console.log(event);'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});

new config.CustomRule(stack, 'CustomRule', {
  lambdaFunction: fn,
  periodic: true,
  ruleScope: config.RuleScope.fromResources([config.ResourceType.EC2_INSTANCE]),
  evaluationModes: config.EvaluationMode.PROACTIVE,
});

new config.ManagedRule(stack, 'ManagedRule', {
  identifier: config.ManagedRuleIdentifiers.API_GW_XRAY_ENABLED,
  evaluationModes: config.EvaluationMode.DETECTIVE_AND_PROACTIVE,
});

const samplePolicyText = `
# This rule checks if point in time recovery (PITR) is enabled on active Amazon DynamoDB tables
let status = ['ACTIVE']

rule tableisactive when
    resourceType == "AWS::DynamoDB::Table" {
    configuration.tableStatus == %status
}

rule checkcompliance when
    resourceType == "AWS::DynamoDB::Table"
    tableisactive {
        let pitr = supplementaryConfiguration.ContinuousBackupsDescription.pointInTimeRecoveryDescription.pointInTimeRecoveryStatus
        %pitr == "ENABLED"
}
`;

new config.CustomPolicy(stack, 'CustomPolicy', {
  policyText: samplePolicyText,
  enableDebugLog: true,
  ruleScope: config.RuleScope.fromResources([config.ResourceType.DYNAMODB_TABLE]),
  evaluationModes: config.EvaluationMode.DETECTIVE,
});

new integ.IntegTest(app, 'ConfigRuleEvaluationModeTest', {
  testCases: [stack],
});
