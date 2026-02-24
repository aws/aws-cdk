import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
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

// AWS Config prerequisites: Configuration Recorder + Delivery Channel
const configRole = new iam.Role(stack, 'ConfigRecorderRole', {
  assumedBy: new iam.ServicePrincipal('config.amazonaws.com'),
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWS_ConfigRole')],
});
const recorder = new config.CfnConfigurationRecorder(stack, 'ConfigRecorder', {
  roleArn: configRole.roleArn,
  recordingGroup: { allSupported: false, resourceTypes: ['AWS::EC2::Instance', 'AWS::DynamoDB::Table', 'AWS::EC2::EIP'] },
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
customRule.node.addDependency(recorder);
customRule.node.addDependency(deliveryChannel);

// Test DETECTIVE evaluation mode on ManagedRule
const managedRule = new config.ManagedRule(stack, 'ManagedRule', {
  identifier: config.ManagedRuleIdentifiers.EIP_ATTACHED,
  evaluationModes: config.EvaluationMode.DETECTIVE,
});
managedRule.node.addDependency(recorder);
managedRule.node.addDependency(deliveryChannel);

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
customPolicy.node.addDependency(recorder);
customPolicy.node.addDependency(deliveryChannel);

new integ.IntegTest(app, 'ConfigRuleEvaluationModeTest', {
  testCases: [stack],
});
