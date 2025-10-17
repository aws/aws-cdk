import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { Stack, aws_ec2 as ec2, aws_elasticloadbalancingv2 as elbv2, App } from 'aws-cdk-lib';
import { Construct } from 'constructs';

class TestStack extends Stack {
  public readonly lbWithSg: elbv2.NetworkLoadBalancer;
  public readonly lbWithSg2: elbv2.NetworkLoadBalancer;
  public readonly lbWithoutSg: elbv2.NetworkLoadBalancer;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Stack', {
      maxAzs: 1,
      natGateways: 0,
    });

    this.lbWithSg = new elbv2.NetworkLoadBalancer(this, 'NlbWithSecurityGroup', {
      vpc,
    });
    this.lbWithSg2 = new elbv2.NetworkLoadBalancer(this, 'NlbWithSecurityGroup2', {
      vpc,
      securityGroups: [new ec2.SecurityGroup(this, 'SecurityGroup', {
        vpc,
        allowAllOutbound: true,
      })],
    });
    this.lbWithSg.connections.allowTo(this.lbWithSg2, ec2.Port.tcp(1229));
    this.lbWithoutSg = new elbv2.NetworkLoadBalancer(this, 'NlbWithoutSecurityGroup', {
      vpc,
      disableSecurityGroups: true,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-elasticloadbalancingv2:networkLoadBalancerWithSecurityGroupByDefault': true,
  },
});
const stack = new TestStack(app, 'NlbSecurityGroupStack');
const integ = new IntegTest(app, 'NlbSecurityGroupInteg', {
  testCases: [stack],
});
integ.assertions.awsApiCall('elastic-load-balancing-v2', 'describeLoadBalancers', {
  LoadBalancerArns: [
    stack.lbWithSg.loadBalancerArn,
    stack.lbWithSg2.loadBalancerArn,
    stack.lbWithoutSg.loadBalancerArn,
  ],
}).expect(ExpectedResult.objectLike({
  LoadBalancers: [
    Match.objectLike({
      LoadBalancerArn: stack.lbWithSg.loadBalancerArn,
      SecurityGroups: Match.arrayWith([
        Match.stringLikeRegexp('sg-[0-9a-f]{8,17}'),
      ]),
    }),
    Match.objectLike({
      LoadBalancerArn: stack.lbWithSg2.loadBalancerArn,
      SecurityGroups: Match.arrayWith([
        Match.stringLikeRegexp('sg-[0-9a-f]{8,17}'),
      ]),
    }),
    Match.objectLike({
      LoadBalancerArn: stack.lbWithoutSg.loadBalancerArn,
      SecurityGroups: undefined,
    }),
  ],
}));
