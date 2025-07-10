import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Stack, aws_ec2 as ec2, aws_elasticloadbalancingv2 as elbv2, App } from 'aws-cdk-lib';
import { Construct } from 'constructs';

class TargetGroupCrossZoneStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Stack');

    new elbv2.NetworkTargetGroup(this, 'TargetGroupCrossZone', {
      vpc,
      port: 80,
      targetType: elbv2.TargetType.INSTANCE,
      crossZoneEnabled: true,
    });
  }
}

const app = new App();
const stack = new TargetGroupCrossZoneStack(app, 'nlb-target-group-cross-zone-stack');

new IntegTest(app, 'nlb-target-group-cross-zone-test-stack', {
  testCases: [stack],
});
