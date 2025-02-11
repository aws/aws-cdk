import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Stack, aws_ec2 as ec2, aws_elasticloadbalancingv2 as elbv2, App } from 'aws-cdk-lib';
import { Construct } from 'constructs';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc,
      minimumCapacityUnit: 150,
    });
    const listener = lb.addListener('Listener', { port: 80 });
    const groupOne = new elbv2.ApplicationTargetGroup(this, 'TargetGroup', {
      vpc, port: 80, targetType: elbv2.TargetType.INSTANCE,
    });

    listener.addTargetGroups('Default', {
      targetGroups: [groupOne],
    });
  }
}

const app = new App();
new IntegTest(app, 'MinimumCapacityUnitAlbInteg', {
  testCases: [
    new TestStack(app, 'MinimumCapacityUnitAlbStack'),
  ],
});
