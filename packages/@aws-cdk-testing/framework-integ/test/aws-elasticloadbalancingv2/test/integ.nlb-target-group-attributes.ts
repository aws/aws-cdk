import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { Stack, aws_ec2 as ec2, aws_elasticloadbalancingv2 as elbv2, App } from 'aws-cdk-lib';

const app = new App();
const stack = new Stack(app, 'nlb-target-group-attributes');

const vpc = new ec2.Vpc(stack, 'Stack');

const targetGroup = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
  vpc,
  port: 80,
  targetGroupHealth: {
    dnsMinimumHealthyTargetCount: 3,
    dnsMinimumHealthyTargetPercentage: 70,
    routingMinimumHealthyTargetCount: 2,
    routingMinimumHealthyTargetPercentage: 50,
  },
});

const integTest = new IntegTest(app, 'nlb-target-group-attributes-test', {
  testCases: [stack],
});

integTest.assertions.awsApiCall('elbv2', 'describeTargetGroupAttributes', {
  TargetGroupArn: targetGroup.targetGroupArn,
}).expect(ExpectedResult.objectLike({
  Attributes: Match.arrayWith([
    {
      Key: 'target_group_health.unhealthy_state_routing.minimum_healthy_targets.count',
      Value: '2',
    },
    {
      Key: 'target_group_health.unhealthy_state_routing.minimum_healthy_targets.percentage',
      Value: '50',
    },
    {
      Key: 'target_group_health.dns_failover.minimum_healthy_targets.count',
      Value: '3',
    },
    {
      Key: 'target_group_health.dns_failover.minimum_healthy_targets.percentage',
      Value: '70',
    },
  ]),
}));
