import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

class VpcReservedPublicSubnetStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ec2.Vpc(this, 'VPC', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
          reserved: true,
        },
        {
          name: 'isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
      natGateways: 0,
    });
  }
}
const stack = new VpcReservedPublicSubnetStack(app, 'aws-cdk-ec2-vpc-reserved-public-subnet');

new IntegTest(app, 'integ-aws-cdk-ec2-vpc-reserved-public-subnet', {
  testCases: [stack],
});

app.synth();
