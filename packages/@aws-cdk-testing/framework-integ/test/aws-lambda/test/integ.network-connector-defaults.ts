import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'NetworkConnectorDefaultsStack');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

new lambda.NetworkConnector(stack, 'NetworkConnector', {
  networkConnectorName: 'integ-test-connector',
  configuration: lambda.NetworkConnectorConfig.vpcEgress({
    subnets: vpc.privateSubnets,
    securityGroups: [securityGroup],
    networkProtocol: lambda.NetworkProtocol.IPV4,
    associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
  }),
});

new integ.IntegTest(app, 'NetworkConnectorDefaultsTest', {
  testCases: [stack],
});
