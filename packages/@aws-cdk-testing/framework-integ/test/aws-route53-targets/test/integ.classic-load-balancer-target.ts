#!/usr/bin/env node
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancing';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const zone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: 'test.public',
    });

    const vpc = new ec2.Vpc(this, 'VPC', {
      restrictDefaultSecurityGroup: false,
      maxAzs: 1,
    });

    const lb = new elb.LoadBalancer(this, 'LB', {
      vpc,
      internetFacing: true,
      listeners: [
        {
          externalPort: 80,
          allowConnectionsFrom: [ec2.Peer.anyIpv4()],
        },
      ],
      healthCheck: {
        port: 80,
      },
    });

    new route53.ARecord(this, 'Alias', {
      zone,
      recordName: 'classic-load-balancer-without-health-check',
      target: route53.RecordTarget.fromAlias(new targets.ClassicLoadBalancerTarget(lb)),
    });

    new route53.ARecord(this, 'AliasWithHealthCheck', {
      zone,
      recordName: 'classic-load-balancer-with-health-check',
      target: route53.RecordTarget.fromAlias(
        new targets.ClassicLoadBalancerTarget(lb, {
          evaluateTargetHealth: true,
        }),
      ),
    });
  }
}

const app = new cdk.App();
const testCase = new TestStack(app, 'aws-cdk-route53-classic-load-balancer-integ');

new IntegTest(app, 'aws-cdk-route53-classic-load-balancer-integ-test', {
  testCases: [testCase],
});
