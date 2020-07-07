import { arrayWith, expect, haveResourceLike, ResourcePart } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import { Duration, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as autoscaling from '../lib';

interface BaseProps {
  vpc: ec2.Vpc;
  machineImage: ec2.IMachineImage;
  instanceType: ec2.InstanceType;
  desiredCapacity: number;
  minCapacity: number;
}

let stack: Stack;
let vpc: ec2.Vpc;
let baseProps: BaseProps;

export = {
  'setUp'(cb: () => void) {
    stack = new Stack();
    vpc = new ec2.Vpc(stack, 'Vpc');

    baseProps = {
      vpc,
      machineImage: new ec2.AmazonLinuxImage(),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      desiredCapacity: 5,
      minCapacity: 2,
    };

    cb();
  },

  'Signals.waitForAll uses desiredCapacity if available'(test: Test) {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
      ...baseProps,
      signals: autoscaling.Signals.waitForAll(),
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
      CreationPolicy: {
        ResourceSignal: {
          Count: 5,
        },
      },
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'Signals.waitForAll uses minCapacity if desiredCapacity is not available'(test: Test) {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
      ...baseProps,
      desiredCapacity: undefined,
      signals: autoscaling.Signals.waitForAll(),
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
      CreationPolicy: {
        ResourceSignal: {
          Count: 2,
        },
      },
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'Signals.waitForMinCapacity uses minCapacity'(test: Test) {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
      ...baseProps,
      signals: autoscaling.Signals.waitForMinCapacity(),
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
      CreationPolicy: {
        ResourceSignal: {
          Count: 2,
        },
      },
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'Signals.waitForCount uses given number'(test: Test) {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
      ...baseProps,
      signals: autoscaling.Signals.waitForCount(10),
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
      CreationPolicy: {
        ResourceSignal: {
          Count: 10,
        },
      },
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'UpdatePolicy.rollingUpdate() still correctly inserts IgnoreUnmodifiedGroupSizeProperties'(test: Test) {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
      ...baseProps,
      updatePolicy: autoscaling.UpdatePolicy.rollingUpdate(),
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
      UpdatePolicy: {
        AutoScalingScheduledAction: {
          IgnoreUnmodifiedGroupSizeProperties: true,
        },
      },
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'UpdatePolicy.rollingUpdate() with Signals uses those defaults'(test: Test) {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
      ...baseProps,
      signals: autoscaling.Signals.waitForCount(10, {
        minSuccessPercentage: 50,
        timeout: Duration.minutes(30),
      }),
      updatePolicy: autoscaling.UpdatePolicy.rollingUpdate(),
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
      CreationPolicy: {
        AutoScalingCreationPolicy: {
          MinSuccessfulInstancesPercent: 50,
        },
        ResourceSignal: {
          Count: 10,
          Timeout: 'PT30M',
        },
      },
      UpdatePolicy: {
        AutoScalingRollingUpdate: {
          MinSuccessfulInstancesPercent: 50,
          PauseTime: 'PT30M',
          WaitOnResourceSignals: true,
        },
      },
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'UpdatePolicy.rollingUpdate() without Signals'(test: Test) {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
      ...baseProps,
      updatePolicy: autoscaling.UpdatePolicy.rollingUpdate(),
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
      UpdatePolicy: {
        AutoScalingRollingUpdate: {
        },
      },
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'UpdatePolicy.replacingUpdate() renders correct UpdatePolicy'(test: Test) {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
      ...baseProps,
      updatePolicy: autoscaling.UpdatePolicy.replacingUpdate(),
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
      UpdatePolicy: {
        AutoScalingReplacingUpdate: {
          WillReplace: true,
        },
      },
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'Using init config in ASG leads to correct UserData and permissions'(test: Test) {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
      ...baseProps,
      init: ec2.CloudFormationInit.fromElements(
        ec2.InitCommand.shellCommand('echo hihi'),
      ),
      signals: autoscaling.Signals.waitForAll(),
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::AutoScaling::LaunchConfiguration', {
      UserData: {
        'Fn::Base64': {
          'Fn::Join': [ '', [
            '#!/bin/bash\n# fingerprint: 6661ddee2afda062\n(\n  set +e\n  /opt/aws/bin/cfn-init -v --region ',
            { Ref: 'AWS::Region' },
            ' --stack ',
            { Ref: 'AWS::StackName' },
            ' --resource AsgASGD1D7B4E2 -c default\n  /opt/aws/bin/cfn-signal -e $? --region ',
            { Ref: 'AWS::Region' },
            ' --stack ',
            { Ref: 'AWS::StackName' },
            ' --resource AsgASGD1D7B4E2\n  cat /var/log/cfn-init.log >&2\n)',
          ]],
        },
      },
    }));
    expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: arrayWith({
          Action: [ 'cloudformation:DescribeStackResource', 'cloudformation:SignalResource' ],
          Effect: 'Allow',
          Resource: { Ref: 'AWS::StackId' },
        }),
      },
    }));

    test.done();
  },
};