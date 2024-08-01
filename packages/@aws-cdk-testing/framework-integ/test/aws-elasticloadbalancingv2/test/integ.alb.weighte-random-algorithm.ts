import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Stack, aws_ec2 as ec2, aws_elasticloadbalancingv2 as elbv2, App } from 'aws-cdk-lib';
import { TargetGroupLoadBalancingAlgorithmType } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

class WeightRandomAlgorithmStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });

    const groupOne = new elbv2.ApplicationTargetGroup(this, 'TargetGroupOne', {
      vpc,
      port: 80,
      targetType: elbv2.TargetType.INSTANCE,
      loadBalancingAlgorithmType: TargetGroupLoadBalancingAlgorithmType.WEIGHTED_RANDOM,
      enableAnomalyMitigation: true,
    });

    const groupTwo = listener.addTargets('TargetGroupTwo', {
      port: 80,
      loadBalancingAlgorithmType: TargetGroupLoadBalancingAlgorithmType.WEIGHTED_RANDOM,
      enableAnomalyMitigation: false,
    });

    listener.addTargetGroups('Default', {
      targetGroups: [groupOne, groupTwo],
    });
  }
}

const app = new App();
const stack = new WeightRandomAlgorithmStack(app, 'alb-weight-rando-algorithm-test-stack');

new IntegTest(app, 'alb-weight-rando-algorithm-test-integ', {
  testCases: [stack],
});
