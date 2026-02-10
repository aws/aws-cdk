import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'CapacityProviderAllFieldsStack');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

const operatorRole = new iam.Role(stack, 'OperatorRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AWSLambdaManagedEC2ResourceOperator')],
});

new lambda.CapacityProvider(stack, 'CapacityProvider', {
  subnets: vpc.privateSubnets,
  securityGroups: [securityGroup],
  operatorRole: operatorRole,
  architectures: [lambda.Architecture.X86_64],
  instanceTypeFilter: lambda.InstanceTypeFilter.allow([ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE)]),
  maxVCpuCount: 12,
  scalingOptions: lambda.ScalingOptions.manual([
    lambda.TargetTrackingScalingPolicy.cpuUtilization(70),
  ]),
});

new integ.IntegTest(app, 'CapacityProviderAllFieldsTest', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'eu-west-1', 'eu-central-1', 'eu-north-1', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1'],
});

// TODO: Uncomment when the Lambda runtime SDK is updated to >= 3.942.0.
// The nodejs22.x Lambda runtime currently ships SDK 3.895.0, which does not
// include GetCapacityProviderCommand (introduced in 3.942.0). The integ-test
// assertion Lambda uses the runtime's built-in SDK, so this assertion fails
// with: "Unable to find command named: GetCapacityProviderCommand".
// See: https://github.com/aws/aws-sdk-js-v3/releases/tag/v3.942.0
// Check runtime SDK version: https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html#nodejs-sdk-included
//
// const getCapacityProvider = testCase.assertions.awsApiCall('Lambda', 'GetCapacityProvider', {
//   CapacityProviderName: capacityProvider.capacityProviderName,
// });
//
// getCapacityProvider.expect(integ.ExpectedResult.objectLike({
//   CapacityProviderArn: capacityProvider.capacityProviderArn,
//   State: 'Active',
//   CapacityProviderScalingConfig: {
//     MaxVCpuCount: 12,
//     ScalingMode: 'Manual',
//     ScalingPolicies: [{
//       PredefinedMetricType: 'LambdaCapacityProviderAverageCPUUtilization',
//       TargetValue: 70,
//     }],
//   },
//   PermissionsConfig: {
//     CapacityProviderOperatorRoleArn: operatorRole.roleArn,
//   },
//   VpcConfig: {
//     SubnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
//     SecurityGroupIds: [securityGroup.securityGroupId],
//   },
//   InstanceRequirements: {
//     Architectures: ['x86_64'],
//     AllowedInstanceTypes: ['m5.large'],
//   },
// }));
