import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import * as autoscaling from '../lib';

describe('scheduled action', () => {
  test('can schedule an action', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const asg = makeAutoScalingGroup(stack);

    // WHEN
    asg.scaleOnSchedule('ScaleOutInTheMorning', {
      schedule: autoscaling.Schedule.cron({ hour: '8', minute: '0' }),
      minCapacity: 10,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::ScheduledAction', {
      Recurrence: '0 8 * * *',
      MinSize: 10,
    });
  });

  test('correctly formats date objects', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const asg = makeAutoScalingGroup(stack);

    // WHEN
    asg.scaleOnSchedule('ScaleOutInTheMorning', {
      schedule: autoscaling.Schedule.cron({ hour: '8' }),
      startTime: new Date(Date.UTC(2033, 8, 10, 12, 0, 0)), // JavaScript's Date is a little silly.
      minCapacity: 11,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::ScheduledAction', {
      StartTime: '2033-09-10T12:00:00Z',
    });
  });

  test('autoscaling group has recommended updatepolicy for scheduled actions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const asg = makeAutoScalingGroup(stack);

    // WHEN
    asg.scaleOnSchedule('ScaleOutInTheMorning', {
      schedule: autoscaling.Schedule.cron({ hour: '8' }),
      minCapacity: 10,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
      Properties: {
        MaxSize: '1',
        MinSize: '1',
        LaunchConfigurationName: { Ref: 'ASGLaunchConfigC00AF12B' },
        Tags: [
          {
            Key: 'Name',
            PropagateAtLaunch: true,
            Value: 'Default/ASG',
          },
        ],
        VPCZoneIdentifier: [
          { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
          { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
        ],
      },
      UpdatePolicy: {
        AutoScalingRollingUpdate: {
          WaitOnResourceSignals: false,
          PauseTime: 'PT0S',
          SuspendProcesses: [
            'HealthCheck',
            'ReplaceUnhealthy',
            'AZRebalance',
            'AlarmNotification',
            'ScheduledActions',
          ],
        },
        AutoScalingScheduledAction: {
          IgnoreUnmodifiedGroupSizeProperties: true,
        },
      },
    });
  });
});

function makeAutoScalingGroup(scope: constructs.Construct) {
  const vpc = new ec2.Vpc(scope, 'VPC');
  return new autoscaling.AutoScalingGroup(scope, 'ASG', {
    vpc,
    instanceType: new ec2.InstanceType('t2.micro'),
    machineImage: new ec2.AmazonLinuxImage(),
    updateType: autoscaling.UpdateType.ROLLING_UPDATE,
  });
}
