import '@aws-cdk/assert/jest';
import autoscaling = require('@aws-cdk/aws-autoscaling');
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import { Stack } from '@aws-cdk/core';
import actions = require('../lib');

test('can use topic as alarm action', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'ASG', {
    minCapacity: 1,
    maxCapacity: 100,
    instanceType: new ec2.InstanceType('t-1000.macro'),
    machineImage: new ec2.AmazonLinuxImage(),
    vpc
  });
  const action = new autoscaling.StepScalingAction(stack, 'Action', {
    autoScalingGroup
  });
  const alarm = new cloudwatch.Alarm(stack, 'Alarm', {
    metric: new cloudwatch.Metric({ namespace: 'AWS', metricName: 'Henk' }),
    evaluationPeriods: 3,
    threshold: 100
  });

  // WHEN
  alarm.addAlarmAction(new actions.AutoScalingAction(action));

  // THEN
  expect(stack).toHaveResource('AWS::CloudWatch::Alarm', {
    AlarmActions: [
      { Ref: "Action62AD07C0" }
    ],
  });
});