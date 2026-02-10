import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'FunctionCapacityProviderMinimalStack');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

const capacityProvider = new lambda.CapacityProvider(stack, 'CapacityProvider', {
  subnets: vpc.privateSubnets,
  securityGroups: [securityGroup],
});

const fn = new lambda.Function(stack, 'Function', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
});

capacityProvider.addFunction(fn);

const testCase = new integ.IntegTest(app, 'FunctionCapacityProviderMinimalTest', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'eu-west-1', 'eu-central-1', 'eu-north-1', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1'],
});

const getFunction = testCase.assertions.awsApiCall('Lambda', 'GetFunction', {
  FunctionName: fn.functionName,
}, [
  'Configuration.State',
]);

getFunction.assertAtPath('Configuration.State', integ.ExpectedResult.stringLikeRegexp('Active'));

// TODO: Uncomment when the Lambda runtime SDK is updated to >= 3.942.0.
// The nodejs22.x Lambda runtime currently ships SDK 3.895.0, which strips
// CapacityProviderConfig fields from the GetFunction response. These fields
// were introduced in 3.942.0.
// See: https://github.com/aws/aws-sdk-js-v3/releases/tag/v3.942.0
// Check runtime SDK version: https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html#nodejs-sdk-included
//
// getFunction.expect(integ.ExpectedResult.objectLike({
//   Configuration: {
//     State: 'Active',
//     CapacityProviderConfig: {
//       LambdaManagedInstancesCapacityProviderConfig: {
//         CapacityProviderArn: capacityProvider.capacityProviderArn,
//       },
//     },
//   },
// }));
