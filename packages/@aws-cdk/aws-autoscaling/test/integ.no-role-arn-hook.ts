import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as autoscaling from '../lib';
import * as constructs from 'constructs';
import * as iam from '@aws-cdk/aws-iam';


export class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let vpc = new ec2.Vpc(this, 'myVpcAuto', {});
    const myrole = new iam.Role(this, 'MyRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    const asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(), // get the latest Amazon Linux image
      healthCheck: autoscaling.HealthCheck.ec2(),
    });

    // no roleArn or notificationTarget
    new autoscaling.LifecycleHook(this, 'LCHookNoRoleNoTarget', {
      autoScalingGroup: asg,
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_TERMINATING,
      defaultResult: autoscaling.DefaultResult.CONTINUE,
      lifecycleHookName: 'TerminateLifecycleHook',
      heartbeatTimeout: cdk.Duration.minutes(3),
    });

    new autoscaling.LifecycleHook(this, 'LCHookNoRoleTarget', {
      notificationTarget: new FakeNotificationTarget(),
      autoScalingGroup: asg,
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_TERMINATING,
      defaultResult: autoscaling.DefaultResult.CONTINUE,
      lifecycleHookName: 'TerminateLifecycleHook2',
      heartbeatTimeout: cdk.Duration.minutes(3),
    });

    // Role and No target causes error
    /*new autoscaling.LifecycleHook(this, 'LCHookRoleNoTarget', {
      notificationTarget: new FakeNotificationTarget(),
      autoScalingGroup: asg,
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_TERMINATING,
      defaultResult: autoscaling.DefaultResult.CONTINUE,
      lifecycleHookName: 'TerminateLifecycleHook2',
      heartbeatTimeout: cdk.Duration.minutes(3),
    });*/

    new autoscaling.LifecycleHook(this, 'LCHookRoleTarget', {
      notificationTarget: new FakeNotificationTarget(),
      role: myrole,
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

class FakeNotificationTarget implements autoscaling.ILifecycleHookTarget {
  public bind(_scope: constructs.Construct, lifecycleHook: autoscaling.ILifecycleHook): autoscaling.LifecycleHookTargetConfig {
    if (lifecycleHook.role) {
      lifecycleHook.role.addToPrincipalPolicy(new iam.PolicyStatement({
        actions: ['action:Work'],
        resources: ['*'],
      }));
    }

    return { notificationTargetArn: 'target:arn' };
  }
}
