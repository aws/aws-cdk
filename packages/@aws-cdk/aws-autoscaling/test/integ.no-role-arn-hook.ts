import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as autoscaling from '../lib';


export class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let vpc = new ec2.Vpc(this, 'myVpcAuto', {});

    const asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(), // get the latest Amazon Linux image
      healthCheck: autoscaling.HealthCheck.ec2(),
    });

    // no roleArn or notificationTarget
    new autoscaling.LifecycleHook(this, 'LCHook', {
      autoScalingGroup: asg,
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_TERMINATING,
      defaultResult: autoscaling.DefaultResult.CONTINUE,
      lifecycleHookName: 'TerminateLifecycleHook2',
      heartbeatTimeout: cdk.Duration.minutes(3),
    });
  }
}

const app = new cdk.App();

new TestStack(app, 'integ-no-role-arn-hook');

app.synth();
