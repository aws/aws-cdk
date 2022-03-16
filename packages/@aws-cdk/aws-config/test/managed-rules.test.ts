import { Template } from '@aws-cdk/assertions';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as config from '../lib';

describe('access keys', () => {
  test('rotated', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.AccessKeysRotated(stack, 'AccessKeys');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Config::ConfigRule', {
      Source: {
        Owner: 'AWS',
        SourceIdentifier: 'ACCESS_KEYS_ROTATED',
      },
    });
  });

  test('rotated with max age', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.AccessKeysRotated(stack, 'AccessKeys', {
      maxAge: cdk.Duration.days(1),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Config::ConfigRule', {
      Source: {
        Owner: 'AWS',
        SourceIdentifier: 'ACCESS_KEYS_ROTATED',
      },
      InputParameters: {
        maxAccessKeyAge: 1,
      },
    });
  });
});

describe('cloudformation stack', () => {
  test('drift detection check', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.CloudFormationStackDriftDetectionCheck(stack, 'Drift');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Config::ConfigRule', {
      Source: {
        Owner: 'AWS',
        SourceIdentifier: 'CLOUDFORMATION_STACK_DRIFT_DETECTION_CHECK',
      },
      InputParameters: {
        cloudformationRoleArn: {
          'Fn::GetAtt': [
            'DriftRole8A5FB833',
            'Arn',
          ],
        },
      },
      Scope: {
        ComplianceResourceTypes: [
          'AWS::CloudFormation::Stack',
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'config.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/ReadOnlyAccess',
            ],
          ],
        },
      ],
    });
  });

  test('notification check', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const topic1 = new sns.Topic(stack, 'AllowedTopic1');
    const topic2 = new sns.Topic(stack, 'AllowedTopic2');

    // WHEN
    new config.CloudFormationStackNotificationCheck(stack, 'Notification', {
      topics: [topic1, topic2],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Config::ConfigRule', {
      Source: {
        Owner: 'AWS',
        SourceIdentifier: 'CLOUDFORMATION_STACK_NOTIFICATION_CHECK',
      },
      InputParameters: {
        snsTopic1: {
          Ref: 'AllowedTopic10C9144F9',
        },
        snsTopic2: {
          Ref: 'AllowedTopic24ECF6C0D',
        },
      },
      Scope: {
        ComplianceResourceTypes: [
          'AWS::CloudFormation::Stack',
        ],
      },
    });
  });

  test('notification check throws with more than 5 topics', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'AllowedTopic1');

    // THEN
    expect(() => new config.CloudFormationStackNotificationCheck(stack, 'Notification', {
      topics: [topic, topic, topic, topic, topic, topic],
    })).toThrow(/5 topics/);
  });
});

describe('ec2 instance', () => {
  test('profile attached check', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.ManagedRule(stack, 'Ec2InstanceProfileAttached', {
      identifier: config.ManagedRuleIdentifiers.EC2_INSTANCE_PROFILE_ATTACHED,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Config::ConfigRule', {
      Source: {
        Owner: 'AWS',
        SourceIdentifier: config.ManagedRuleIdentifiers.EC2_INSTANCE_PROFILE_ATTACHED,
      },
    });
  });
});

describe('s3 bucket level', () => {
  test('public access prohibited', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.ManagedRule(stack, 'S3BucketLevelPublicAccessProhibited', {
      identifier: config.ManagedRuleIdentifiers.S3_BUCKET_LEVEL_PUBLIC_ACCESS_PROHIBITED,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Config::ConfigRule', {
      Source: {
        Owner: 'AWS',
        SourceIdentifier: config.ManagedRuleIdentifiers.S3_BUCKET_LEVEL_PUBLIC_ACCESS_PROHIBITED,
      },
    });
  });
});
