import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as config from 'aws-cdk-lib/aws-config';
import { STANDARD_NODEJS_RUNTIME } from '../../config';
import { ConfigPrerequisites } from './config-test-helpers';

const app = new cdk.App({
  context: { '@aws-cdk/core:disableGitSource': true },
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'ConfigRuleEvaluationMode');

const prerequisites = new ConfigPrerequisites(stack, 'ConfigPrerequisites', {
  resourceTypes: ['AWS::EC2::Instance', 'AWS::DynamoDB::Table', 'AWS::EC2::EIP'],
});

const fn = new lambda.Function(stack, 'CustomFunction', {
  code: lambda.AssetCode.fromInline('exports.handler = (event) => console.log(event);'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});

// Test DETECTIVE evaluation mode on CustomRule (Lambda-based)
const customRule = new config.CustomRule(stack, 'CustomRule', {
  lambdaFunction: fn,
  periodic: true,
  ruleScope: config.RuleScope.fromResources([config.ResourceType.EC2_INSTANCE]),
  evaluationModes: config.EvaluationMode.DETECTIVE,
});
customRule.node.addDependency(prerequisites.recorder);
customRule.node.addDependency(prerequisites.deliveryChannel);

// Test DETECTIVE evaluation mode on ManagedRule
const managedRule = new config.ManagedRule(stack, 'ManagedRule', {
  identifier: config.ManagedRuleIdentifiers.EIP_ATTACHED,
  evaluationModes: config.EvaluationMode.DETECTIVE,
});
managedRule.node.addDependency(prerequisites.recorder);
managedRule.node.addDependency(prerequisites.deliveryChannel);

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

// Test DETECTIVE evaluation mode on CustomPolicy (Guard-based)
const customPolicy = new config.CustomPolicy(stack, 'CustomPolicy', {
  policyText: samplePolicyText,
  enableDebugLog: true,
  ruleScope: config.RuleScope.fromResources([config.ResourceType.DYNAMODB_TABLE]),
  evaluationModes: config.EvaluationMode.DETECTIVE,
});
customPolicy.node.addDependency(prerequisites.recorder);
customPolicy.node.addDependency(prerequisites.deliveryChannel);

new integ.IntegTest(app, 'ConfigRuleEvaluationModeTest', {
  testCases: [stack],
});
