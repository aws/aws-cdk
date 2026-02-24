import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as config from 'aws-cdk-lib/aws-config';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-config-rule');

// AWS Config prerequisites: Configuration Recorder + Delivery Channel
const configRole = new iam.Role(stack, 'ConfigRecorderRole', {
  assumedBy: new iam.ServicePrincipal('config.amazonaws.com'),
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWS_ConfigRole')],
});
const recorder = new config.CfnConfigurationRecorder(stack, 'ConfigRecorder', {
  roleArn: configRole.roleArn,
  recordingGroup: { allSupported: false, resourceTypes: ['AWS::CloudFormation::Stack', 'AWS::EC2::Instance'] },
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
customRule.node.addDependency(recorder);
customRule.node.addDependency(deliveryChannel);

// A rule to detect stacks drifts
const driftRule = new config.CloudFormationStackDriftDetectionCheck(stack, 'Drift');
driftRule.node.addDependency(recorder);
driftRule.node.addDependency(deliveryChannel);

// Topic for compliance events
const complianceTopic = new sns.Topic(stack, 'ComplianceTopic');

// Send notification on compliance change
driftRule.onComplianceChange('ComplianceChange', {
  target: new targets.SnsTopic(complianceTopic),
});

new integ.IntegTest(app, 'aws-cdk-config-rule-integ', {
  testCases: [stack],
});
