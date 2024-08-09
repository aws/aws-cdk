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

  test('instantiate Activity with EncryptionConfiguration using Customer Managed Key', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const kmsKey = new kms.Key(stack, 'Key');

    // WHEN
    new stepfunctions.Activity(stack, 'Activity', {
      kmsKey: kmsKey,
      kmsDataKeyReusePeriodSeconds: cdk.Duration.seconds(75),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::Activity', {
      Name: 'Activity',
      EncryptionConfiguration: Match.objectLike({
        KmsKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
        KmsDataKeyReusePeriodSeconds: 75,
        Type: 'CUSTOMER_MANAGED_KMS_KEY',
      }),
    });
  });

  test('instantiate Activity with invalid KmsDataKeyReusePeriodSeconds throws error', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const kmsKey = new kms.Key(stack, 'Key');

    // FAIL
    expect(() => {
      // WHEN
      new stepfunctions.Activity(stack, 'Activity', {
        kmsKey: kmsKey,
        kmsDataKeyReusePeriodSeconds: cdk.Duration.seconds(5),
      });
    }).toThrow('kmsDataKeyReusePeriodSeconds needs to be a value between 60 and 900');

  }),

  test('instantiate Activity with no kms key throws error', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // FAIL
    expect(() => {
      // WHEN
      new stepfunctions.Activity(stack, 'Activity', {
        kmsDataKeyReusePeriodSeconds: cdk.Duration.seconds(5),
      });
    }).toThrow('You cannot set kmsDataKeyReusePeriodSeconds without providing a kms key');
  }),

  test('instantiate Activity with EncryptionConfiguration using AWS Owned Key', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new stepfunctions.Activity(stack, 'Activity', {
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
