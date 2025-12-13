import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'CapacityProviderDefaultsStack');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

const capacityProvider = new lambda.CapacityProvider(stack, 'CapacityProvider', {
  subnets: vpc.privateSubnets,
  securityGroups: [securityGroup],
});

const testCase = new integ.IntegTest(app, 'CapacityProviderDefaultsTest', {
  testCases: [stack],
});

const getCapacityProvider = testCase.assertions.awsApiCall('Lambda', 'GetCapacityProvider', {
  CapacityProviderName: capacityProvider.capacityProviderName,
});

getCapacityProvider.expect(integ.ExpectedResult.objectLike({
  State: 'Active',
  PermissionsConfig: {
    CapacityProviderOperatorRoleArn: integ.ExpectedResult.stringLikeRegexp('arn:aws:iam::\\d{12}:role/.+'),
  },
  VpcConfig: {
    SubnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
    SecurityGroupIds: [securityGroup.securityGroupId],
  },
}));
