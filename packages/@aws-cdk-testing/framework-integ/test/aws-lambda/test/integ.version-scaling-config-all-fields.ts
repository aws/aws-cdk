import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'VersionScalingConfigAllFieldsStack');

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
  currentVersionOptions: {
    minExecutionEnvironments: 1,
    maxExecutionEnvironments: 5,
  },
});

capacityProvider.addFunction(fn);

const version = fn.currentVersion;

const testCase = new integ.IntegTest(app, 'VersionScalingConfigAllFieldsTest', {
  testCases: [stack],
});

const listVersionsByFunction = testCase.assertions.awsApiCall('Lambda', 'listVersionsByFunction', {
  FunctionName: version.functionArn,
});

listVersionsByFunction.expect(integ.ExpectedResult.objectLike({
  Versions: [
    {
      FunctionScalingConfig: {
        MinExecutionEnvironments: 1,
        MaxExecutionEnvironments: 5,
      },
    },
  ],
}));
