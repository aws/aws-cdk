import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { FileSystem } from 'aws-cdk-lib/aws-efs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'efs-from-imported-subnet');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  natGateways: 1,
  restrictDefaultSecurityGroup: false,
  subnetConfiguration: [
    {
      name: 'test',
      subnetType: ec2.SubnetType.PUBLIC,
    },
  ],
});

const subnet = ec2.Subnet.fromSubnetAttributes(stack, 'Subnet', {
  subnetId: vpc.publicSubnets[0].subnetId,
});

new FileSystem(stack, 'FileSystem', {
  vpc,
  vpcSubnets: {
    subnets: [subnet],
  },
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'efs-from-imported-subnet-test', {
  testCases: [stack],
});
