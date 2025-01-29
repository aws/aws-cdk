import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Stack, aws_ec2 as ec2, aws_elasticloadbalancingv2 as elbv2, App } from 'aws-cdk-lib';
import { Construct } from 'constructs';

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
