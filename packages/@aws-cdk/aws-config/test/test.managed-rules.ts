import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as config from '../lib';

export = {
  'access keys rotated'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.AccessKeysRotated(stack, 'AccessKeys');

    // THEN
    expect(stack).to(haveResource('AWS::Config::ConfigRule', {
      Source: {
        Owner: 'AWS',
        SourceIdentifier: 'ACCESS_KEYS_ROTATED',
      },
    }));

    test.done();
  },

  'cloudformation stack drift detection check'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.CloudFormationStackDriftDetectionCheck(stack, 'Drift');

    // THEN
    expect(stack).to(haveResource('AWS::Config::ConfigRule', {
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
    }));

    expect(stack).to(haveResource('AWS::IAM::Role', {
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
    }));

    test.done();
  },

  'cloudformation stack notification check'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const topic1 = new sns.Topic(stack, 'AllowedTopic1');
    const topic2 = new sns.Topic(stack, 'AllowedTopic2');

    // WHEN
    new config.CloudFormationStackNotificationCheck(stack, 'Notification', {
      topics: [topic1, topic2],
    });

    // THEN
    expect(stack).to(haveResource('AWS::Config::ConfigRule', {
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
    }));

    test.done();
  },

  'cloudformation stack notification check throws with more than 5 topics'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'AllowedTopic1');

    // THEN
    test.throws(() => new config.CloudFormationStackNotificationCheck(stack, 'Notification', {
      topics: [topic, topic, topic, topic, topic, topic],
    }), /5 topics/);

    test.done();
  },
};
