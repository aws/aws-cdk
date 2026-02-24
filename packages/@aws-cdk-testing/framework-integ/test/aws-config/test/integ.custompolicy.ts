import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as config from 'aws-cdk-lib/aws-config';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-config-custompolicy');

// AWS Config prerequisites: Configuration Recorder + Delivery Channel
const configRole = new iam.Role(stack, 'ConfigRecorderRole', {
  assumedBy: new iam.ServicePrincipal('config.amazonaws.com'),
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWS_ConfigRole')],
});
const recorder = new config.CfnConfigurationRecorder(stack, 'ConfigRecorder', {
  roleArn: configRole.roleArn,
  recordingGroup: { allSupported: false, resourceTypes: ['AWS::DynamoDB::Table'] },
});
const deliveryBucket = new s3.Bucket(stack, 'ConfigDeliveryBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
deliveryBucket.addToResourcePolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  principals: [new iam.ServicePrincipal('config.amazonaws.com')],
  actions: ['s3:GetBucketAcl', 's3:ListBucket'],
  resources: [deliveryBucket.bucketArn],
}));
deliveryBucket.addToResourcePolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  principals: [new iam.ServicePrincipal('config.amazonaws.com')],
  actions: ['s3:PutObject'],
  resources: [deliveryBucket.arnForObjects('AWSLogs/*')],
  conditions: {
    StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' },
  },
}));
const deliveryChannel = new config.CfnDeliveryChannel(stack, 'ConfigDeliveryChannel', {
  s3BucketName: deliveryBucket.bucketName,
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
customRule.node.addDependency(recorder);
customRule.node.addDependency(deliveryChannel);

const user = new iam.User(stack, 'sample-user');
const customRuleLazy = new config.CustomPolicy(stack, 'Custom-lazy', {
  policyText: 'rule check_iam_user { resourceType == "AWS::IAM::User" }',
  enableDebugLog: true,
  ruleScope: config.RuleScope.fromResource(config.ResourceType.IAM_USER, user.userName),
});
customRuleLazy.node.addDependency(recorder);
customRuleLazy.node.addDependency(deliveryChannel);

new integ.IntegTest(app, 'aws-cdk-config-custompolicy-integ', {
  testCases: [stack],
});
app.synth();
