import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as config from 'aws-cdk-lib/aws-config';
import { ConfigPrerequisites } from './config-test-helpers';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-config-custompolicy');

const prerequisites = new ConfigPrerequisites(stack, 'ConfigPrerequisites', {
  resourceTypes: ['AWS::DynamoDB::Table'],
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

const customRule = new config.CustomPolicy(stack, 'Custom', {
  policyText: samplePolicyText,
  enableDebugLog: true,
  ruleScope: config.RuleScope.fromResources([config.ResourceType.DYNAMODB_TABLE]),
});
customRule.node.addDependency(prerequisites.recorder);
customRule.node.addDependency(prerequisites.deliveryChannel);

const user = new iam.User(stack, 'sample-user');
const customRuleLazy = new config.CustomPolicy(stack, 'Custom-lazy', {
  policyText: 'rule check_iam_user { resourceType == "AWS::IAM::User" }',
  enableDebugLog: true,
  ruleScope: config.RuleScope.fromResource(config.ResourceType.IAM_USER, user.userName),
});
customRuleLazy.node.addDependency(prerequisites.recorder);
customRuleLazy.node.addDependency(prerequisites.deliveryChannel);

new integ.IntegTest(app, 'aws-cdk-config-custompolicy-integ', {
  testCases: [stack],
});
app.synth();
