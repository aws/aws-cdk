import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { NetworkConnector } from '../lib';

// A network connector on its own: the VPC subnets it uses and the operator role it gets by default
const app = new cdk.App();
const stack = new cdk.Stack(app, 'WebFunctionNetworkConnector');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  natGateways: 0,
  subnetConfiguration: [{ name: 'isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED, cidrMask: 24 }],
});
new NetworkConnector(stack, 'Connector', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
});

new integ.IntegTest(app, 'WebFunctionNetworkConnectorTest', { testCases: [stack] });
