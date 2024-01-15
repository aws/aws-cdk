import { Template } from '../../assertions';
import * as cloudwatch from '../../aws-cloudwatch';
import * as lambda from '../../aws-lambda';
import { Stack } from '../../core';
import { LAMBDA_PERMISSION_LOGICAL_ID_FOR_LAMBDA_ACTION } from '../../cx-api';
import * as actions from '../lib/index';

test('can use lambda as alarm action', () => {
  // GIVEN
  const stack = new Stack();
  const alarm = new cloudwatch.Alarm(stack, 'Alarm', {
    metric: new cloudwatch.Metric({
      namespace: 'AWS',
      metricName: 'Test',
    }),
    evaluationPeriods: 3,
    threshold: 100,
  });

  // WHEN
  const alarmLambda = new lambda.Function(stack, 'alarmLambda', {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: 'alarmLambda',
    code: lambda.Code.fromInline(`
def handler(event, context):
  print('event:', event)
  print('.............................................')
  print('context:', context)`),
    handler: 'index.handler',
  });
  alarm.addAlarmAction(new actions.LambdaAction(alarmLambda));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
    AlarmActions: [
      {
        'Fn::GetAtt': [
          'alarmLambda131DB691',
          'Arn',
        ],
      },
    ],
  });
});

test('can use lambda alias as alarm action', () => {
  // GIVEN
  const stack = new Stack();
  const alarm = new cloudwatch.Alarm(stack, 'Alarm', {
    metric: new cloudwatch.Metric({
      namespace: 'AWS',
      metricName: 'Test',
    }),
    evaluationPeriods: 3,
    threshold: 100,
  });

  // WHEN
  const alarmLambda = new lambda.Function(stack, 'alarmLambda', {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: 'alarmLambda',
    code: lambda.Code.fromInline(`
def handler(event, context):
  print('event:', event)
  print('.............................................')
  print('context:', context)`),
    handler: 'index.handler',
  });
  const aliasName = alarmLambda.addAlias('aliasName');
  alarm.addAlarmAction(new actions.LambdaAction(aliasName));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
    AlarmActions: [
      {
        Ref: 'alarmLambdaAliasaliasName41B27313',
      },
    ],
  });
});

test('can use lambda version as alarm action', () => {
  // GIVEN
  const stack = new Stack();
  const alarm = new cloudwatch.Alarm(stack, 'Alarm', {
    metric: new cloudwatch.Metric({ namespace: 'AWS', metricName: 'Test' }),
    evaluationPeriods: 3,
    threshold: 100,
  });

  // WHEN
  const alarmLambda = new lambda.Function(stack, 'alarmLambda', {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: 'alarmLambda',
    code: lambda.Code.fromInline(`
def handler(event, context):
  print('event:', event)
  print('.............................................')
  print('context:', context)`),
    handler: 'index.handler',
  });
  const version = alarmLambda.currentVersion;
  alarm.addAlarmAction(new actions.LambdaAction(version));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
    AlarmActions: [
      {
        Ref: 'alarmLambdaCurrentVersionBDCE825Cf5e98d107ecb420808f3d9421127310e',
      },
    ],
  });
});

test('can create multiple alarms for the same lambda if feature flag is set', () => {
  // GIVEN
  const stack = new Stack();
  stack.node.setContext(LAMBDA_PERMISSION_LOGICAL_ID_FOR_LAMBDA_ACTION, true);
  const alarm1 = new cloudwatch.Alarm(stack, 'Alarm1', {
    metric: new cloudwatch.Metric({ namespace: 'AWS', metricName: 'Test' }),
    evaluationPeriods: 3,
    threshold: 100,
  });
  const alarm2 = new cloudwatch.Alarm(stack, 'Alarm2', {
    metric: new cloudwatch.Metric({ namespace: 'AWS', metricName: 'Test2' }),
    evaluationPeriods: 3,
    threshold: 100,
  });

  // WHEN
  const alarmLambda = new lambda.Function(stack, 'alarmLambda', {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: 'alarmLambda',
    code: lambda.Code.fromInline(`
def handler(event, context):
  print('event:', event)
  print('.............................................')
  print('context:', context)`),
    handler: 'index.handler',
  });
  alarm1.addAlarmAction(new actions.LambdaAction(alarmLambda));
  alarm2.addAlarmAction(new actions.LambdaAction(alarmLambda));

  // THEN
  Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 2);
  Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 2);
});