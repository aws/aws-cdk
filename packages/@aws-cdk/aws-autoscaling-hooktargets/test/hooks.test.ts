import { Match, Template } from '@aws-cdk/assertions';
import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import { Stack } from '@aws-cdk/core';
import * as hooks from '../lib';


describe('given an AutoScalingGroup and no role', () => {
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

  afterEach(() => {
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
  });

  test('can use queue as hook target without providing a role', () => {
    // GIVEN
    const queue = new sqs.Queue(stack, 'Queue');

    // WHEN
    asg.addLifecycleHook('Trans', {
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
      notificationTarget: new hooks.QueueHook(queue),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', { NotificationTargetARN: { 'Fn::GetAtt': ['Queue4A7E3555', 'Arn'] } });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'sqs:SendMessage',
              'sqs:GetQueueAttributes',
              'sqs:GetQueueUrl',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'Queue4A7E3555',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'ASGLifecycleHookTransRoleDefaultPolicy43D7C82A',
      Roles: [
        {
          Ref: 'ASGLifecycleHookTransRole71E0A219',
        },
      ],
    });
  });

  test('can use topic as hook target without providing a role', () => {
    // GIVEN
    const topic = new sns.Topic(stack, 'Topic');

    // WHEN
    asg.addLifecycleHook('Trans', {
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
      notificationTarget: new hooks.TopicHook(topic),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', { NotificationTargetARN: { Ref: 'TopicBFC7AF6E' } });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'TopicBFC7AF6E',
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'ASGLifecycleHookTransRoleDefaultPolicy43D7C82A',
      Roles: [
        {
          Ref: 'ASGLifecycleHookTransRole71E0A219',
        },
      ],
    });
  });

  test('can use Lambda function as hook target without providing a role', () => {
    // GIVEN
    const fn = new lambda.Function(stack, 'Fn', {
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.index',
    });

    // WHEN
    asg.addLifecycleHook('Trans', {
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
      notificationTarget: new hooks.FunctionHook(fn),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', { NotificationTargetARN: { Ref: 'ASGLifecycleHookTransTopic9B0D4842' } });
    Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
      Protocol: 'lambda',
      TopicArn: { Ref: 'ASGLifecycleHookTransTopic9B0D4842' },
      Endpoint: { 'Fn::GetAtt': ['Fn9270CBC0', 'Arn'] },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'ASGLifecycleHookTransTopic9B0D4842',
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'ASGLifecycleHookTransRoleDefaultPolicy43D7C82A',
      Roles: [
        {
          Ref: 'ASGLifecycleHookTransRole71E0A219',
        },
      ],
    });
  });

  test('can use Lambda function as hook target with encrypted SNS', () => {
    // GIVEN
    const key = new kms.Key(stack, 'key');
    const fn = new lambda.Function(stack, 'Fn', {
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.index',
    });

    // WHEN
    asg.addLifecycleHook('Trans', {
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
      notificationTarget: new hooks.FunctionHook(fn, key),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {
      KmsMasterKeyId: {
        'Fn::GetAtt': [
          'keyFEDD6EC0',
          'Arn',
        ],
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          {
            Effect: 'Allow',
            Action: [
              'kms:Decrypt',
              'kms:GenerateDataKey',
            ],
            Resource: {
              'Fn::GetAtt': [
                'keyFEDD6EC0',
                'Arn',
              ],
            },
          },
        ]),
      },
    });
  });
});

describe('given an AutoScalingGroup and a role', () => {
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

  afterEach(() => {
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

  test('can use queue as hook target with a role', () => {
    // GIVEN
    const queue = new sqs.Queue(stack, 'Queue');
    const myrole = new iam.Role(stack, 'MyRole', {
      assumedBy: new iam.ServicePrincipal('custom.role.domain.com'),
    });
    // WHEN
    asg.addLifecycleHook('Trans', {
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
      notificationTarget: new hooks.QueueHook(queue),
      role: myrole,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', { NotificationTargetARN: { 'Fn::GetAtt': ['Queue4A7E3555', 'Arn'] } });
  });

  test('can use topic as hook target with a role', () => {
    // GIVEN
    const topic = new sns.Topic(stack, 'Topic');
    const myrole = new iam.Role(stack, 'MyRole', {
      assumedBy: new iam.ServicePrincipal('custom.role.domain.com'),
    });

    // WHEN
    asg.addLifecycleHook('Trans', {
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
      notificationTarget: new hooks.TopicHook(topic),
      role: myrole,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', { NotificationTargetARN: { Ref: 'TopicBFC7AF6E' } });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'TopicBFC7AF6E',
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'MyRoleDefaultPolicyA36BE1DD',
      Roles: [
        {
          Ref: 'MyRoleF48FFE04',
        },
      ],
    });
  });

  test('can use Lambda function as hook target with a role', () => {
    // GIVEN
    const fn = new lambda.Function(stack, 'Fn', {
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.index',
    });
    const myrole = new iam.Role(stack, 'MyRole', {
      assumedBy: new iam.ServicePrincipal('custom.role.domain.com'),
    });

    // WHEN
    asg.addLifecycleHook('Trans', {
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
      notificationTarget: new hooks.FunctionHook(fn),
      role: myrole,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', { NotificationTargetARN: { Ref: 'ASGLifecycleHookTransTopic9B0D4842' } });
    Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
      Protocol: 'lambda',
      TopicArn: { Ref: 'ASGLifecycleHookTransTopic9B0D4842' },
      Endpoint: { 'Fn::GetAtt': ['Fn9270CBC0', 'Arn'] },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'ASGLifecycleHookTransTopic9B0D4842',
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'MyRoleDefaultPolicyA36BE1DD',
      Roles: [
        {
          Ref: 'MyRoleF48FFE04',
        },
      ],
    });
  });
});
