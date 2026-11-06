/**
 * This test requires a non-zero Service Quotas limit for "network-load-balancer-capacity-units".
 * By default, accounts have a quota of 0, which causes CloudFormation to reject any
 * MinimumLoadBalancerCapacity.CapacityUnits value with:
 *   "CapacityUnits exceeds the maximum value of '0'"
 * Request a quota increase via Service Quotas before running this test.
 */
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Stack, aws_ec2 as ec2, aws_elasticloadbalancingv2 as elbv2, App } from 'aws-cdk-lib';
import type { Construct } from 'constructs';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Stack', {
      maxAzs: 1,
    });
    const lb = new elbv2.NetworkLoadBalancer(this, 'LB', {
      vpc,
      // minimumCapacityUnit is devided by number of availability zones
      // In this case, 2750 / 1 = 2750
      minimumCapacityUnit: 2750,
    });
    const listener = lb.addListener('Listener', { port: 80 });
    const groupOne = new elbv2.NetworkTargetGroup(this, 'TargetGroup', {
      vpc, port: 80, targetType: elbv2.TargetType.INSTANCE,
    });

    listener.addTargetGroups('Default', groupOne);
  }
}

const app = new App();
new IntegTest(app, 'MinimumCapacityUnitNlbInteg', {
  testCases: [
    new TestStack(app, 'MinimumCapacityUnitNlbStack'),
  ],
});
