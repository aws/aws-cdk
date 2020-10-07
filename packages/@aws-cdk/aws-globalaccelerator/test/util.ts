import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { App, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';

export function testFixture() {
  const { stack, app } = testFixtureNoVpc();
  const vpc = new ec2.Vpc(stack, 'VPC');

  return { stack, vpc, app };
}

export function testFixtureNoVpc() {
  const app = new App();
  const stack = new Stack(app, 'Stack');
  return { stack, app };
}

export function testFixtureAlb() {
  const { stack, app, vpc } = testFixture();
  const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc, internetFacing: true });

  return { stack, app, alb, vpc };
}

export function testFixtureNlb() {
  const { stack, app, vpc } = testFixture();
  const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', { vpc, internetFacing: true });

  return { stack, app, nlb };
}

export function testFixtureEip() {
  const { stack, app } = testFixtureNoVpc();
  const eip = new ec2.CfnEIP(stack, 'ElasticIpAddress');

  return { stack, app, eip };
}

export function testFixtureEc2() {
  const { stack, app, vpc } = testFixture();
  const instance = new ec2.Instance(stack, 'Ec2', {
    vpc,
    machineImage: new ec2.AmazonLinuxImage(),
    instanceType: new ec2.InstanceType('t3.small'),
  });

  return { stack, app, instance };
}

export class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}
