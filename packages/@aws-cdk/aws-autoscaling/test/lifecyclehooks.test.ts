import { Match, Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import * as autoscaling from '../lib';

describe('lifecycle hooks', () => {
  test('we can add a lifecycle hook with no role and with a notifcationTarget to an ASG', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const asg = newASG(stack);

    // WHEN
    asg.addLifecycleHook('Transition', {
      notificationTarget: new FakeNotificationTarget(),
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
      defaultResult: autoscaling.DefaultResult.ABANDON,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', {
      LifecycleTransition: 'autoscaling:EC2_INSTANCE_LAUNCHING',
      DefaultResult: 'ABANDON',
      NotificationTargetARN: 'target:arn',
    });

    // Lifecycle Hook has a dependency on the policy object
    Template.fromStack(stack).hasResource('AWS::AutoScaling::LifecycleHook', {
      DependsOn: [
        'ASGLifecycleHookTransitionRoleDefaultPolicy2E50C7DB',
        'ASGLifecycleHookTransitionRole3AAA6BB7',
      ],
    });

    // A default role is provided
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'autoscaling.amazonaws.com',
            },
          },
        ],
      },
    });

    // FakeNotificationTarget.bind() was executed
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'action:Work',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    });
  });
});

test('we can add a lifecycle hook to an ASG with no role and with no notificationTargetArn', ()=> {
  // GIVEN
  const stack = new cdk.Stack();
  const asg = newASG(stack);

  // WHEN
  asg.addLifecycleHook('Transition', {
    lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
    defaultResult: autoscaling.DefaultResult.ABANDON,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', {
    LifecycleTransition: 'autoscaling:EC2_INSTANCE_LAUNCHING',
    DefaultResult: 'ABANDON',
  });

  // A default role is NOT provided
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', Match.not({
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'autoscaling.amazonaws.com',
          },
        },
      ],
    },
  }));

  // FakeNotificationTarget.bind() was NOT executed
  Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
});

test('we can add a lifecycle hook to an ASG with a role and with a notificationTargetArn', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const asg = newASG(stack);
  const myrole = new iam.Role(stack, 'MyRole', {
    assumedBy: new iam.ServicePrincipal('custom.role.domain.com'),
  });

  // WHEN
  asg.addLifecycleHook('Transition', {
    lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
    defaultResult: autoscaling.DefaultResult.ABANDON,
    notificationTarget: new FakeNotificationTarget(),
    role: myrole,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', {
    NotificationTargetARN: 'target:arn',
    LifecycleTransition: 'autoscaling:EC2_INSTANCE_LAUNCHING',
    DefaultResult: 'ABANDON',
  });

  // the provided role (myrole), not the default role, is used
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'custom.role.domain.com',
          },
        },
      ],
    },
  });
});

test('adding a lifecycle hook with a role and with no notificationTarget to an ASG throws an error', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const asg = newASG(stack);
  const myrole = new iam.Role(stack, 'MyRole', {
    assumedBy: new iam.ServicePrincipal('custom.role.domain.com'),
  });

  // WHEN
  expect(() => {
    asg.addLifecycleHook('Transition', {
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
      defaultResult: autoscaling.DefaultResult.ABANDON,
      role: myrole,
    });
  }).toThrow(/'notificationTarget' parameter required when 'role' parameter is specified/);
});

class FakeNotificationTarget implements autoscaling.ILifecycleHookTarget {
  private createRole(scope: constructs.Construct, _role?: iam.IRole) {
    let role = _role;
    if (!role) {
      role = new iam.Role(scope, 'Role', {
        assumedBy: new iam.ServicePrincipal('autoscaling.amazonaws.com'),
      });
    }

    return role;
  }

  public bind(_scope: constructs.Construct, options: autoscaling.BindHookTargetOptions): autoscaling.LifecycleHookTargetConfig {
    const role = this.createRole(options.lifecycleHook, options.role);

    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['action:Work'],
      resources: ['*'],
    }));

    return { notificationTargetArn: 'target:arn', createdRole: role };
  }
}

function newASG(stack: cdk.Stack) {
  const vpc = new ec2.Vpc(stack, 'VPC');

  return new autoscaling.AutoScalingGroup(stack, 'ASG', {
    vpc,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
    machineImage: new ec2.AmazonLinuxImage(),
  });
}
