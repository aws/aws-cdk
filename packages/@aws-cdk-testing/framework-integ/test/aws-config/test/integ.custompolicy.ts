import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as config from 'aws-cdk-lib/aws-config';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-config-custompolicy');

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

new config.CustomPolicy(stack, 'Custom', {
  policyText: samplePolicyText,
  enableDebugLog: true,
  ruleScope: config.RuleScope.fromResources([config.ResourceType.DYNAMODB_TABLE]),
});

const user = new iam.User(stack, 'sample-user');
new config.CustomPolicy(stack, 'Custom-lazy', {
  policyText: 'lazy-create-test',
  enableDebugLog: true,
  ruleScope: config.RuleScope.fromResource(config.ResourceType.IAM_USER, user.userName),
});

new integ.IntegTest(app, 'aws-cdk-config-custompolicy-integ', {
  testCases: [stack],
});
app.synth();
