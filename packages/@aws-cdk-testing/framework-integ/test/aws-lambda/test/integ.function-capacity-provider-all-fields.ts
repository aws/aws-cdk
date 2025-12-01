import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'FunctionCapacityProviderAllFieldsStack');

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

capacityProvider.addFunction(fn, {
  perExecutionEnvironmentMaxConcurrency: 10,
  executionEnvironmentMemoryGiBPerVCpu: 2,
  publishToLatestPublished: true,
  latestPublishedScalingConfig: {
    minExecutionEnvironments: 1,
    maxExecutionEnvironments: 5,
  },
});

const testCase = new integ.IntegTest(app, 'FunctionCapacityProviderAllFieldsTest', {
  testCases: [stack],
});

const getFunction = testCase.assertions.awsApiCall('Lambda', 'GetFunction', {
  FunctionName: fn.functionName,
});

getFunction.expect(integ.ExpectedResult.objectLike({
  Configuration: {
    State: 'Active',
    PublishToLatestPublished: true,
    CapacityProviderConfig: {
      LambdaManagedInstancesCapacityProviderConfig: {
        CapacityProviderArn: capacityProvider.capacityProviderArn,
        PerExecutionEnvironmentMaxConcurrency: 10,
        ExecutionEnvironmentMemoryGiBPerVCpu: 2,
      },
    },
    FunctionScalingConfig: {
      MinExecutionEnvironments: 1,
      MaxExecutionEnvironments: 5,
    },
  },
}));
