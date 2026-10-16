import * as cdk from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';
import {
  NetworkConnector,
  NetworkConnectorComputeType,
  NetworkConnectorConfiguration,
} from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App({ analyticsReporting: false });
const stack = new cdk.Stack(app, 'NetworkConnectorStack');

// Isolated subnets: the connector provisions ENIs into them, and the test needs no
// egress of its own — no NAT gateways or internet gateway to slow the stack down.
const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  natGateways: 0,
  subnetConfiguration: [
    { name: 'isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  ],
});

const securityGroup = new ec2.SecurityGroup(stack, 'ConnectorSecurityGroup', {
  vpc,
  allowAllOutbound: true,
});

// MicroVm rather than WebFunction: the published registry schema accepts only MicroVm
// today, so this is the compute type a real deployment can exercise. The construct
// code under test is the same for both.
const connector = new NetworkConnector(stack, 'Connector', {
  configuration: NetworkConnectorConfiguration.vpcEgress({
    computeType: NetworkConnectorComputeType.MICRO_VM,
    vpc,
    securityGroups: [securityGroup],
  }),
});

new cdk.CfnOutput(stack, 'ConnectorArn', { value: connector.networkConnectorArn });

new integ.IntegTest(app, 'NetworkConnectorTest', {
  testCases: [stack],
  diffAssets: false,
});
