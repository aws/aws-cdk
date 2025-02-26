import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

export class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'myVpcAuto', { restrictDefaultSecurityGroup: false });

    new autoscaling.AutoScalingGroup(this, 'EC2HealthChecks', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(), // get the latest Amazon Linux image
      healthChecks: autoscaling.HealthChecks.ec2(
        {
          gracePeriod: cdk.Duration.seconds(100),
        },
      ),
    });

    new autoscaling.AutoScalingGroup(this, 'AdditionalHealthChecks', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(), // get the latest Amazon Linux image
      healthChecks: autoscaling.HealthChecks.withAdditionalChecks({
        gracePeriod: cdk.Duration.seconds(100),
        additionalTypes: [
          autoscaling.AdditionalHealthCheckType.EBS,
          autoscaling.AdditionalHealthCheckType.ELB,
          autoscaling.AdditionalHealthCheckType.VPC_LATTICE,
        ],
      }),
    });

    new autoscaling.AutoScalingGroup(this, 'HealthChecksWithoutGrace', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(), // get the latest Amazon Linux image
      healthChecks: autoscaling.HealthChecks.withAdditionalChecks({
        additionalTypes: [
          autoscaling.AdditionalHealthCheckType.ELB,
        ],
      }),
    });
  }
}

const app = new cdk.App();

const stack = new TestStack(app, 'integ-health-checks');

new IntegTest(app, 'AutoScalingGroupHealthChecks', {
  testCases: [stack],
});
