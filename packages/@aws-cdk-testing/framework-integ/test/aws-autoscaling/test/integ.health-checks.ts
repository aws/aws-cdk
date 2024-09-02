import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

export class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let vpc = new ec2.Vpc(this, 'myVpcAuto', { restrictDefaultSecurityGroup: false });

    new autoscaling.AutoScalingGroup(this, 'ASG', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(), // get the latest Amazon Linux image
      healthChecks: {
        healthCheckTypes: [autoscaling.HealthCheckType.ELB, autoscaling.HealthCheckType.EBS, autoscaling.HealthCheckType.VPC_LATTICE],
        // grace: cdk.Duration.seconds(100),
      },
    });
  }
}

const app = new cdk.App();

const stack = new TestStack(app, 'integ-health-checks');

new IntegTest(app, 'AutoScalingGroupHealthChecks', {
  testCases: [stack],
});
