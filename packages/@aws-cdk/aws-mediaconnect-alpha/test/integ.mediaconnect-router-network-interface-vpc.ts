import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Vpc, IpAddresses, SubnetType, PrivateSubnet, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { RouterNetworkConfiguration, RouterNetworkInterface } from '../lib/router-network-interface';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-mediaconnect-router-ni-vpc');

const vpc = new Vpc(stack, 'testvpc', {
  ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
  subnetConfiguration: [{
    name: 'subnet1',
    subnetType: SubnetType.PRIVATE_ISOLATED,
    cidrMask: 24,
  }],
});
const subnet = new PrivateSubnet(stack, 'mysubnet', {
  availabilityZone: `${stack.region}a`,
  cidrBlock: '10.0.172.0/24',
  vpcId: vpc.vpcId,
});

new RouterNetworkInterface(stack, 'network', {
  routerNetworkInterfaceName: 'test',
  configuration: RouterNetworkConfiguration.vpc({
    securityGroups: [new SecurityGroup(stack, 'sg', {
      vpc,
    })],
    subnet,
  }),
});

new IntegTest(app, 'cdk-integ-emx-router-network-interface-vpc', {
  testCases: [stack],
});

app.synth();
