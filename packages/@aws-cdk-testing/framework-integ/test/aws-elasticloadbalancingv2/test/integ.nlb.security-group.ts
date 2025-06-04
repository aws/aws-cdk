import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Stack, aws_ec2 as ec2, aws_elasticloadbalancingv2 as elbv2, App } from 'aws-cdk-lib';
import { Construct } from 'constructs';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Stack', {
      maxAzs: 1,
      natGateways: 0,
    });

    const lbWithSg = new elbv2.NetworkLoadBalancer(this, 'NlbWithSecurityGroup', {
      vpc,
    });
    const lbWithSg2 = new elbv2.NetworkLoadBalancer(this, 'NlbWithSecurityGroup2', {
      vpc,
      securityGroups: [new ec2.SecurityGroup(this, 'SecurityGroup', {
        vpc,
        allowAllOutbound: true,
      })],
    });
    lbWithSg.connections.allowTo(lbWithSg2, ec2.Port.tcp(1229));
    const lbWithoutSg = new elbv2.NetworkLoadBalancer(this, 'NlbWithoutSecurityGroup', {
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

const integ = new IntegTest(app, 'NlbSecurityGroupInteg', {
  testCases: [
    new TestStack(app, 'NlbSecurityGroupStack'),
  ],
});
