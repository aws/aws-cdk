import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'NetworkConnectorAllFieldsStack');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const securityGroup1 = new ec2.SecurityGroup(stack, 'SecurityGroup1', { vpc });
const securityGroup2 = new ec2.SecurityGroup(stack, 'SecurityGroup2', { vpc });

const operatorRole = new iam.Role(stack, 'OperatorRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('AWSLambdaNetworkConnectorOperatorPolicy'),
  ],
});

new lambda.NetworkConnector(stack, 'NetworkConnector', {
  networkConnectorName: 'integ-test-all-fields',
  configuration: lambda.NetworkConnectorConfig.vpcEgress({
    subnets: vpc.privateSubnets,
    securityGroups: [securityGroup1, securityGroup2],
    networkProtocol: lambda.NetworkProtocol.IPV4,
    associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
  }),
  operatorRole,
});

new integ.IntegTest(app, 'NetworkConnectorAllFieldsTest', {
  testCases: [stack],
});
