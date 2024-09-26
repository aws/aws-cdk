import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as cdk from '../../core';
import * as stepfunctions from '../lib';

describe('Activity', () => {
  test('instantiate Activity', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new stepfunctions.Activity(stack, 'Activity');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::Activity', {
      Name: 'Activity',
    });
  });

  test('Activity exposes metrics', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const activity = new stepfunctions.Activity(stack, 'Activity');

    // THEN
    const sharedMetric = {
      period: cdk.Duration.minutes(5),
      namespace: 'AWS/States',
      dimensions: { ActivityArn: { Ref: 'Activity04690B0A' } },
    };
    expect((stack.resolve(activity.metricRunTime()))).toEqual({
      ...sharedMetric,
      metricName: 'ActivityRunTime',
      statistic: 'Average',
    });

    expect(stack.resolve(activity.metricFailed())).toEqual({
      ...sharedMetric,
      metricName: 'ActivitiesFailed',
      statistic: 'Sum',
    });
  });

  test('Activity can grant permissions to a role', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    const activity = new stepfunctions.Activity(stack, 'Activity');

    // WHEN
    activity.grant(role, 'states:SendTaskSuccess');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([Match.objectLike({
          Action: 'states:SendTaskSuccess',
          Effect: 'Allow',
          Resource: {
            Ref: 'Activity04690B0A',
          },
        })]),
      },
    });

  });

  test('Instantiate Activity with EncryptionConfiguration using Customer Managed Key', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const kmsKey = new kms.Key(stack, 'Key');

    // WHEN
    new stepfunctions.Activity(stack, 'Activity', {
      encryptionConfiguration: new stepfunctions.CustomerManagedEncryptionConfiguration(kmsKey, cdk.Duration.seconds(75)),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::Activity', {
      Name: 'Activity',
      EncryptionConfiguration: Match.objectEquals({
        KmsKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
        KmsDataKeyReusePeriodSeconds: 75,
        Type: 'CUSTOMER_MANAGED_KMS_KEY',
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          {
            Action: 'kms:*',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':iam::',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':root',
                  ],
                ],
              },
            },
            Resource: '*',
          },
          {
            Action: [
              'kms:Decrypt',
              'kms:GenerateDataKey',
            ],
            Condition: {
              StringEquals: {
                'kms:EncryptionContext:aws:states:activityArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':states:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':activity:Activity',
                    ],
                  ],
                },
              },
            },
            Effect: 'Allow',
            Principal: {
              Service: 'states.amazonaws.com',
            },
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('Instantiate Activity with EncryptionConfiguration using Customer Managed Key - defaults to 300 secs for KmsDataKeyReusePeriodSeconds', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const kmsKey = new kms.Key(stack, 'Key');

    // WHEN
    new stepfunctions.Activity(stack, 'Activity', {
      encryptionConfiguration: new stepfunctions.CustomerManagedEncryptionConfiguration(kmsKey),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::Activity', {
      Name: 'Activity',
      EncryptionConfiguration: Match.objectEquals({
        KmsKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
        KmsDataKeyReusePeriodSeconds: 300,
        Type: 'CUSTOMER_MANAGED_KMS_KEY',
      }),
    });
  });

  test('Instantiate Activity with invalid KmsDataKeyReusePeriodSeconds throws error', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const kmsKey = new kms.Key(stack, 'Key');

    // FAIL
    expect(() => {
      // WHEN
      new stepfunctions.Activity(stack, 'Activity', {
        encryptionConfiguration: new stepfunctions.CustomerManagedEncryptionConfiguration(kmsKey, cdk.Duration.seconds(5)),
      });
    }).toThrow('kmsDataKeyReusePeriodSeconds must have a value between 60 and 900 seconds');
  }),

  test('Instantiate Activity with EncryptionConfiguration using AWS Owned Key', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new stepfunctions.Activity(stack, 'Activity', {
      encryptionConfiguration: new stepfunctions.AwsOwnedEncryptionConfiguration(),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::Activity', {
      Name: 'Activity',
      EncryptionConfiguration: Match.objectLike({
        Type: 'AWS_OWNED_KEY',
      }),
    });
  });
});
