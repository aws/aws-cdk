import { expect, haveResource, MatchStyle, } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import autoscaling = require('../lib');

export = {
  'can schedule an action'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const asg = makeAutoScalingGroup(stack);

    // WHEN
    asg.scaleOnSchedule('ScaleOutInTheMorning', {
      schedule: autoscaling.Cron.dailyUtc(8),
      minCapacity: 10,
    });

    // THEN
    expect(stack).to(haveResource('AWS::AutoScaling::ScheduledAction', {
      Recurrence: '0 8 * * *',
      MinSize: 10
    }));

    test.done();
  },

  'correctly formats date objects'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const asg = makeAutoScalingGroup(stack);

    // WHEN
    asg.scaleOnSchedule('ScaleOutInTheMorning', {
      schedule: autoscaling.Cron.dailyUtc(8),
      startTime: new Date(Date.UTC(2033, 8, 10, 12, 0, 0)),      // JavaScript's Date is a little silly.
      minCapacity: 11,
    });

    // THEN
    expect(stack).to(haveResource('AWS::AutoScaling::ScheduledAction', {
      StartTime: '2033-09-10T12:00:00Z'
    }));

    test.done();
  },

  'autoscaling group has recommended updatepolicy for scheduled actions'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const asg = makeAutoScalingGroup(stack);

    // WHEN
    asg.scaleOnSchedule('ScaleOutInTheMorning', {
      schedule: autoscaling.Cron.dailyUtc(8),
      minCapacity: 10,
    });

    // THEN
    expect(stack).toMatch({
      Resources: {
        ASG46ED3070: {
          Type: "AWS::AutoScaling::AutoScalingGroup",
          Properties: {
            MaxSize: "1",
            MinSize: "1",
            DesiredCapacity: "1",
            LaunchConfigurationName: { Ref: "ASGLaunchConfigC00AF12B" },
            Tags: [
              {
                Key: "Name",
                PropagateAtLaunch: true,
                Value: "ASG"
              }
            ],
            VPCZoneIdentifier: [
              { Ref: "VPCPrivateSubnet1Subnet8BCA10E0" },
              { Ref: "VPCPrivateSubnet2SubnetCFCDAA7A" },
              { Ref: "VPCPrivateSubnet3Subnet3EDCD457" }
            ]
          },
          UpdatePolicy: {
            AutoScalingRollingUpdate: {
              WaitOnResourceSignals: false,
              PauseTime: "PT0S",
              SuspendProcesses: [
                "HealthCheck",
                "ReplaceUnhealthy",
                "AZRebalance",
                "AlarmNotification",
                "ScheduledActions"
              ]
            },
            AutoScalingScheduledAction: {
              IgnoreUnmodifiedGroupSizeProperties: true
            }
          },
        }
      },
    }, MatchStyle.SUPERSET);

    test.done();
  },
};

function makeAutoScalingGroup(scope: cdk.Construct) {
  const vpc = new ec2.VpcNetwork(scope, 'VPC');
  return new autoscaling.AutoScalingGroup(scope, 'ASG', {
    vpc,
    instanceType: new ec2.InstanceType('t2.micro'),
    machineImage: new ec2.AmazonLinuxImage(),
    updateType: autoscaling.UpdateType.RollingUpdate,
  });
}
