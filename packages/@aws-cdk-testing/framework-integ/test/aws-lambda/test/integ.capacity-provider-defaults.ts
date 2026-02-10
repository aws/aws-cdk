import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'CapacityProviderDefaultsStack');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

new lambda.CapacityProvider(stack, 'CapacityProvider', {
  subnets: vpc.privateSubnets,
  securityGroups: [securityGroup],
});

new integ.IntegTest(app, 'CapacityProviderDefaultsTest', {
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
//   State: 'Active',
//   PermissionsConfig: {
//     CapacityProviderOperatorRoleArn: integ.ExpectedResult.stringLikeRegexp('arn:aws:iam::\\d{12}:role/.+'),
//   },
//   VpcConfig: {
//     SubnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
//     SecurityGroupIds: [securityGroup.securityGroupId],
//   },
// }));
