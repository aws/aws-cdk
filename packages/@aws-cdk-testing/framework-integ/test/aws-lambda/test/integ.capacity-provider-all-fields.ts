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
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonLambdaCapacityProviderOperatorRolePolicy')],
});

const capacityProvider = new lambda.CapacityProvider(stack, 'CapacityProvider', {
  capacityProviderName: 'test-capacity-provider',
  subnets: vpc.privateSubnets,
  securityGroups: [securityGroup],
  operatorRole: operatorRole,
  architectures: [lambda.Architecture.X86_64],
  instanceTypeFilter: lambda.InstanceTypeFilter.allow([ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO)]),
  maxVCpuCount: 12,
  scalingOptions: lambda.ScalingOptions.manual([
    lambda.TargetTrackingScalingPolicy.cpuUtilization(70),
  ]),
});

const testCase = new integ.IntegTest(app, 'CapacityProviderAllFieldsTest', {
  testCases: [stack],
});

const getCapacityProvider = testCase.assertions.awsApiCall('Lambda', 'GetCapacityProvider', {
  CapacityProviderName: capacityProvider.capacityProviderName,
});

getCapacityProvider.expect(integ.ExpectedResult.objectLike({
  CapacityProviderArn: capacityProvider.capacityProviderArn,
  State: 'Active',
  CapacityProviderScalingConfig: {
    MaxVCpuCount: 12,
    ScalingMode: 'Manual',
    ScalingPolicies: [{
      PredefinedMetricType: 'LambdaCapacityProviderAverageCPUUtilization',
      TargetValue: 70,
    }],
  },
  PermissionsConfig: {
    CapacityProviderOperatorRoleArn: operatorRole.roleArn,
  },
  VpcConfig: {
    SubnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
    SecurityGroupIds: [securityGroup.securityGroupId],
  },
  InstanceRequirements: {
    Architectures: ['x86_64'],
    AllowedInstanceTypes: ['t2.micro'],
  },
}));
