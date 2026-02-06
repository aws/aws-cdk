import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

// Stack 1: Create the capacity provider
const providerStack = new cdk.Stack(app, 'CapacityProviderStack');

const vpc = new ec2.Vpc(providerStack, 'Vpc');
const securityGroup = new ec2.SecurityGroup(providerStack, 'SecurityGroup', { vpc });

const capacityProvider = new lambda.CapacityProvider(providerStack, 'CapacityProvider', {
  subnets: vpc.privateSubnets,
  securityGroups: [securityGroup],
});

// Stack 2: Import the capacity provider and add a function to it
const functionStack = new cdk.Stack(app, 'FunctionStack');

const importedCapacityProvider = lambda.CapacityProvider.fromCapacityProviderArn(
  functionStack,
  'ImportedCapacityProvider',
  capacityProvider.capacityProviderArn,
);

const fn = new lambda.Function(functionStack, 'Function', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
});

importedCapacityProvider.addFunction(fn);

const testCase = new integ.IntegTest(app, 'FunctionCapacityProviderImportedTest', {
  testCases: [providerStack, functionStack],
});

const getFunction = testCase.assertions.awsApiCall('Lambda', 'GetFunction', {
  FunctionName: fn.functionName,
});

getFunction.expect(integ.ExpectedResult.objectLike({
  Configuration: {
    State: 'Active',
    CapacityProviderConfig: {
      LambdaManagedInstancesCapacityProviderConfig: {
        CapacityProviderArn: capacityProvider.capacityProviderArn,
      },
    },
  },
}));
