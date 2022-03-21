import { Annotations, Template } from '@aws-cdk/assertions';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import * as targets from '../../lib';

test('use AwsApi as an event rule target', () => {
  // GIVEN
  const stack = new Stack();
  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(15 minutes)'),
  });

  // WHEN
  rule.addTarget(new targets.AwsApi({
    service: 'ECS',
    action: 'updateService',
    parameters: {
      service: 'cool-service',
      forceNewDeployment: true,
    } as AWS.ECS.UpdateServiceRequest,
    catchErrorPattern: 'error',
    apiVersion: '2019-01-01',
  }));

  rule.addTarget(new targets.AwsApi({
    service: 'RDS',
    action: 'createDBSnapshot',
    parameters: {
      DBInstanceIdentifier: 'cool-instance',
    } as AWS.RDS.CreateDBSnapshotMessage,
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    Targets: [
      {
        Arn: {
          'Fn::GetAtt': [
            'AWSb4cf1abd4e4f4bc699441af7ccd9ec371511E620',
            'Arn',
          ],
        },
        Id: 'Target0',
        Input: JSON.stringify({
          service: 'ECS',
          action: 'updateService',
          parameters: {
            service: 'cool-service',
            forceNewDeployment: true,
          },
          catchErrorPattern: 'error',
          apiVersion: '2019-01-01',
        }),
      },
      {
        Arn: {
          'Fn::GetAtt': [
            'AWSb4cf1abd4e4f4bc699441af7ccd9ec371511E620',
            'Arn',
          ],
        },
        Id: 'Target1',
        Input: JSON.stringify({
          service: 'RDS',
          action: 'createDBSnapshot',
          parameters: {
            DBInstanceIdentifier: 'cool-instance',
          },
        }),
      },
    ],
  });

  // Uses a singleton function
  Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'ecs:UpdateService',
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Action: 'rds:CreateDBSnapshot',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('with policy statement', () => {
  // GIVEN
  const stack = new Stack();
  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(15 minutes)'),
  });

  // WHEN
  rule.addTarget(new targets.AwsApi({
    service: 'service',
    action: 'action',
    policyStatement: new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: ['resource'],
    }),
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    Targets: [
      {
        Arn: {
          'Fn::GetAtt': [
            'AWSb4cf1abd4e4f4bc699441af7ccd9ec371511E620',
            'Arn',
          ],
        },
        Id: 'Target0',
        Input: JSON.stringify({ // No `policyStatement`
          service: 'service',
          action: 'action',
        }),
      },
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 's3:GetObject',
          Effect: 'Allow',
          Resource: 'resource',
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('with service not in AWS SDK', () => {
  // GIVEN
  const stack = new Stack();
  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(15 minutes)'),
  });
  const awsApi = new targets.AwsApi({
    service: 'no-such-service',
    action: 'no-such-action',
    policyStatement: new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: ['resource'],
    }),
  });

  // WHEN
  rule.addTarget(awsApi);

  // THEN
  Annotations.fromStack(stack).hasWarning('*', 'Service no-such-service does not exist in the AWS SDK. Check the list of available services and actions from https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html');
});
