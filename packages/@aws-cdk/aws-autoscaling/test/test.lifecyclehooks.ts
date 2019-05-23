import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import autoscaling_api = require('@aws-cdk/aws-autoscaling-api');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import autoscaling = require('../lib');

export = {
  'we can add a lifecycle hook to an ASG'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
      vpc,
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
      machineImage: new ec2.AmazonLinuxImage(),
    });

    // WHEN
    asg.addLifecycleHook('Transition', {
      notificationTarget: new FakeNotificationTarget(),
      lifecycleTransition: autoscaling.LifecycleTransition.InstanceLaunching,
      defaultResult: autoscaling.DefaultResult.Abandon,
    });

    // THEN
    expect(stack).to(haveResource('AWS::AutoScaling::LifecycleHook', {
      LifecycleTransition: "autoscaling:EC2_INSTANCE_LAUNCHING",
      DefaultResult: "ABANDON",
      NotificationTargetARN: "target:arn",
    }));

    // Lifecycle Hook has a dependency on the policy object
    expect(stack).to(haveResource('AWS::AutoScaling::LifecycleHook', {
      DependsOn: [
        "ASGLifecycleHookTransitionRoleDefaultPolicy2E50C7DB",
        "ASGLifecycleHookTransitionRole3AAA6BB7",
      ]
    }, ResourcePart.CompleteDefinition));

    expect(stack).to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: { Service: { "Fn::Join": ["", ["autoscaling.", { Ref: "AWS::URLSuffix" }]] } }
          }
        ],
      }
    }));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: "action:Work",
            Effect: "Allow",
            Resource: "*"
          }
        ],
      }
    }));

    test.done();
  }
};

class FakeNotificationTarget implements autoscaling_api.ILifecycleHookTarget {
  public asLifecycleHookTarget(lifecycleHook: autoscaling_api.ILifecycleHook): autoscaling_api.LifecycleHookTargetProps {
    lifecycleHook.role.addToPolicy(new iam.PolicyStatement()
      .addAction('action:Work')
      .addAllResources());
    return { notificationTargetArn: 'target:arn', };
  }
}
