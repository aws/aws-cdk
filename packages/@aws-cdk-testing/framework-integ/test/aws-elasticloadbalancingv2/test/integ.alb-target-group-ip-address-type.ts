import { Stack, App } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const ipv4Vpc = new ec2.Vpc(this, 'Ipv4Vpc', {
      natGateways: 0,
    });
    const dualstackVpc = new ec2.Vpc(this, 'DualstackVpc', {
      natGateways: 0,
      ipProtocol: ec2.IpProtocol.DUAL_STACK,
    });

    new elbv2.ApplicationTargetGroup(this, 'Ipv4TargetGroup', {
      vpc: ipv4Vpc,
      port: 80,
      targetType: elbv2.TargetType.INSTANCE,
      ipAddressType: elbv2.TargetGroupIpAddressType.IPV4,
    });

    new elbv2.ApplicationTargetGroup(this, 'Ipv6TargetGroup', {
      vpc: dualstackVpc,
      port: 80,
      targetType: elbv2.TargetType.INSTANCE,
      ipAddressType: elbv2.TargetGroupIpAddressType.IPV6,
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'AlbTargetGroupIpAddressTypeTestStack');

new IntegTest(app, 'AlbTargetGroupIpAddressTypeTestInteg', {
  testCases: [stack],
});
