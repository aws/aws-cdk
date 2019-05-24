import '@aws-cdk/assert/jest';
import autoscaling = require('@aws-cdk/aws-autoscaling');
import ec2 = require('@aws-cdk/aws-ec2');
import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import { Stack } from '@aws-cdk/cdk';
import hooks = require('../lib');

describe('given an AutoScalingGroup', () => {
  let stack: Stack;
  let asg: autoscaling.AutoScalingGroup;

  beforeEach(() => {
    stack = new Stack();

    const vpc = new ec2.Vpc(stack, 'VPC');
    asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: new ec2.AmazonLinuxImage(),
    });
  });

  test('can use queue as hook target', () => {
    // GIVEN
    const queue = new sqs.Queue(stack, 'Queue');

    // WHEN
    asg.onLifecycleTransition('Trans', {
      lifecycleTransition: autoscaling.LifecycleTransition.InstanceLaunching,
      notificationTarget: new hooks.QueueHook(queue),
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::LifecycleHook', {
      NotificationTargetARN: { "Fn::GetAtt": [ "Queue4A7E3555", "Arn" ] } });
  });

  test('can use topic as hook target', () => {
    // GIVEN
    const topic = new sns.Topic(stack, 'Topic');

    // WHEN
    asg.onLifecycleTransition('Trans', {
      lifecycleTransition: autoscaling.LifecycleTransition.InstanceLaunching,
      notificationTarget: new hooks.TopicHook(topic),
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::LifecycleHook', {
      NotificationTargetARN: { Ref: "TopicBFC7AF6E" }
    });
  });

  test('can use Lambda function as hook target', () => {
    // GIVEN
    const fn = new lambda.Function(stack, 'Fn', {
      code: lambda.Code.inline('foo'),
      runtime: lambda.Runtime.NodeJS810,
      handler: 'index.index',
    });

    // WHEN
    asg.onLifecycleTransition('Trans', {
      lifecycleTransition: autoscaling.LifecycleTransition.InstanceLaunching,
      notificationTarget: new hooks.FunctionHook(fn),
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::LifecycleHook', {
      NotificationTargetARN: { Ref: "ASGLifecycleHookTransTopic9B0D4842" }
    });
    expect(stack).toHaveResource('AWS::SNS::Subscription', {
      Protocol: "lambda",
      TopicArn: { Ref: "ASGLifecycleHookTransTopic9B0D4842" },
      Endpoint: { "Fn::GetAtt": [ "Fn9270CBC0", "Arn" ] }
    });
  });
});
