import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'FunctionAcceleratorConfigStack');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

const capacityProvider = new lambda.CapacityProvider(stack, 'CapacityProvider', {
  subnets: vpc.privateSubnets,
  securityGroups: [securityGroup],
  architectures: [lambda.Architecture.X86_64],
  instanceTypeFilter: lambda.InstanceTypeFilter.allow([
    ec2.InstanceType.of(ec2.InstanceClass.G6, ec2.InstanceSize.XLARGE),
  ]),
});

const fn = new lambda.Function(stack, 'Function', {
  runtime: lambda.Runtime.FROM_IMAGE,
  handler: lambda.Handler.FROM_IMAGE,
  code: lambda.Code.fromAssetImage(path.join(__dirname, 'docker-lambda-handler')),
  memorySize: 2048,
  acceleratorConfig: {
    acceleratorMemorySize: lambda.AcceleratorMemorySize.GIB_24,
  },
});

capacityProvider.addFunction(fn);

new integ.IntegTest(app, 'FunctionAcceleratorConfigTest', {
  testCases: [stack],
  // These are IntegTest execution regions — NOT a feature allowlist.
  // This list defines where the integ-runner deploys the test stack during CI.
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'eu-west-1', 'eu-central-1', 'eu-north-1', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1'],
});
