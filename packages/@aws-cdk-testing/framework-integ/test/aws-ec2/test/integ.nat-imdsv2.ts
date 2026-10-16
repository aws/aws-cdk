import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'nat-instances-imdsv2');
const provider = ec2.NatProvider.instanceV2({
  instanceType: new ec2.InstanceType('t3.micro'),
  requireImdsv2: true,
  defaultAllowedTraffic: ec2.NatTrafficDirection.OUTBOUND_ONLY,
});
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1, natGateways: 1, natGatewayProvider: provider });
provider.connections.allowFrom(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.allTraffic());
const integ = new IntegTest(app, 'NatImdsv2', { testCases: [stack] });
integ.assertions.awsApiCall('EC2', 'describeInstances', { InstanceIds: [provider.gatewayInstances[0].instanceId] })
  .assertAtPath('Reservations.0.Instances.0.MetadataOptions.HttpTokens', ExpectedResult.exact('required'));
