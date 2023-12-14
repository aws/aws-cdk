import { App, Stack } from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const salt = 'Deploy4';

const app = new App();
const stack = new Stack(app, `OneIPv6Block${salt}`);

//new ec2.VpcDualStack(stack, 'TestVpcDualStack');
/*
new ec2.Vpc(stack, `MyVpc${salt}`, {
  subnetConfiguration: [
    {
      cidrMask: 24,
      name: 'ingress',
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      cidrMask: 24,
      name: 'application',
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
    {
      cidrMask: 28,
      name: 'rds',
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    },
  ],
});
*/
/*
new ec2.VpcDualStackOneIPv6Block(stack, `TestVpcDualStackOneIPv6Block${salt}`, {
  vpc: myVpc,
});
*/
new ec2.Vpc(stack, 'DualStackVpc', {
  vpcProtocol: ec2.VpcProtocol.DUAL_STACK,
});

new IntegTest(app, 'DualStackTesting', {
  testCases: [stack],
});

