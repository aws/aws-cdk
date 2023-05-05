import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Stack, aws_ec2 as ec2, aws_elasticloadbalancingv2 as elbv2, App } from 'aws-cdk-lib';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';
import { Construct } from 'constructs';

class AddTwoTargetGroupsAtOnce extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    const vpc = new ec2.Vpc(this, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });
    const groupOne = new elbv2.ApplicationTargetGroup(this, 'TargetGroupOne', {
      vpc, port: 80, targetType: elbv2.TargetType.INSTANCE,
    });
    const groupTwo = new elbv2.ApplicationTargetGroup(this, 'TargetGroupTwo', {
      vpc, port: 80, targetType: elbv2.TargetType.INSTANCE,
    });

    listener.addTargetGroups('Default', {
      targetGroups: [groupOne, groupTwo],
    });
  }
}

const app = new App();
new IntegTest(app, 'issue-24805', {
  testCases: [
    new AddTwoTargetGroupsAtOnce(app, 'Basic'),
  ],
});
