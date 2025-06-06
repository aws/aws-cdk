import { Annotations, Match, Template } from '../../assertions';
import * as appscaling from '../../aws-applicationautoscaling';
import * as cloudwatch from '../../aws-cloudwatch';
import * as dynamodb from '../../aws-dynamodb';
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
  alarm1.addOkAction(new actions.LambdaAction(alarmLambda));
  alarm1.addInsufficientDataAction(new actions.LambdaAction(alarmLambda));

  alarm2.addAlarmAction(new actions.LambdaAction(alarmLambda));
  alarm2.addOkAction(new actions.LambdaAction(alarmLambda));
  alarm2.addInsufficientDataAction(new actions.LambdaAction(alarmLambda));

  // THEN
  Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 2);
  Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 2);
});

test('can create alarms of multiple step scaling policy for the same lambda if useUniquePermissionId is set', () => {
  // GIVEN
  const stack = new Stack();

  const table = new dynamodb.Table(stack, 'MyTable', {
    partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  });

  const scalableTarget = table.autoScaleReadCapacity({
    minCapacity: 1,
    maxCapacity: 10,
  });

  const policy1 = new appscaling.StepScalingPolicy(stack, 'Policy1', {
    scalingTarget: scalableTarget as unknown as appscaling.IScalableTarget, // Double cast
    metric: table.metricConsumedReadCapacityUnits(),
    scalingSteps: [
      { lower: 0, upper: 1, change: -1 },
      { lower: 5, change: +1 },
    ],
  });

  const policy2 = new appscaling.StepScalingPolicy(stack, 'Policy2', {
    scalingTarget: scalableTarget as unknown as appscaling.IScalableTarget, // Double cast
    metric: table.metricConsumedReadCapacityUnits(),
    scalingSteps: [
      { lower: 0, upper: 2, change: -1 },
      { lower: 6, change: +1 },
    ],
  });

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

  const alarmLambda2 = new lambda.Function(stack, 'alarmLambda2', {
    runtime: lambda.Runtime.PYTHON_3_12,
    functionName: 'alarmLambda',
    code: lambda.Code.fromInline(`
def handler(event, context):
  print('event:', event)
  print('.............................................')
  print('context:', context)`),
    handler: 'index.handler',
  });

  const lambdaAction = new actions.LambdaAction(alarmLambda, {
    useUniquePermissionId: true,
  });
  const lambdaAction2 = new actions.LambdaAction(alarmLambda2, {
    useUniquePermissionId: true,
  });

  // WHEN
  policy1.lowerAlarm?.addAlarmAction(lambdaAction);
  policy2.lowerAlarm?.addAlarmAction(lambdaAction);
  policy1.lowerAlarm?.addAlarmAction(lambdaAction2);
  policy2.lowerAlarm?.addAlarmAction(lambdaAction2);

  // THEN
  Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 4);
  Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 4);
});

test('when creating alarms of multiple step scaling policy for the same lambda, throw warning when useUniquePermissionId is not set', () => {
  // GIVEN
  const stack = new Stack();

  const table = new dynamodb.Table(stack, 'MyTable', {
    partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  });

  const scalableTarget = table.autoScaleReadCapacity({
    minCapacity: 1,
    maxCapacity: 10,
  });

  const policy1 = new appscaling.StepScalingPolicy(stack, 'Policy1', {
    scalingTarget: scalableTarget as unknown as appscaling.IScalableTarget, // Double cast
    metric: table.metricConsumedReadCapacityUnits(),
    scalingSteps: [
      { lower: 0, upper: 1, change: -1 },
      { lower: 5, change: +1 },
    ],
  });

  const policy2 = new appscaling.StepScalingPolicy(stack, 'Policy2', {
    scalingTarget: scalableTarget as unknown as appscaling.IScalableTarget, // Double cast
    metric: table.metricConsumedReadCapacityUnits(),
    scalingSteps: [
      { lower: 0, upper: 1, change: -1 },
      { lower: 5, change: +1 },
    ],
  });

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

  const lambdaAction = new actions.LambdaAction(alarmLambda);

  // WHEN
  policy1.lowerAlarm?.addAlarmAction(lambdaAction);

  try {
    policy2.lowerAlarm?.addAlarmAction(lambdaAction);
  } catch {
    const annotations = Annotations.fromStack(stack);
    annotations.hasWarning('/Default/Policy2/LowerAlarm', Match.stringLikeRegexp('Please use \'useUniquePermissionId\' on LambdaAction'));
  }
});

test('throws when multiple alarms are created for the same lambda if feature flag is set to false', () => {
  // GIVEN
  const stack = new Stack();
  stack.node.setContext(LAMBDA_PERMISSION_LOGICAL_ID_FOR_LAMBDA_ACTION, false); // Default, but explicit just in case.
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
  alarm1.addOkAction(new actions.LambdaAction(alarmLambda));
  alarm1.addInsufficientDataAction(new actions.LambdaAction(alarmLambda));

  // THEN
  expect(() => {
    alarm2.addAlarmAction(new actions.LambdaAction(alarmLambda));
  }).toThrow(/There is already a Construct with name 'AlarmPermission' in Function \[alarmLambda\]/);
});

test('can use same lambda for same action multiple time', () => {
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
  alarm.addAlarmAction(new actions.LambdaAction(alarmLambda));
  alarm.addAlarmAction(new actions.LambdaAction(alarmLambda));

  // THEN
  Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 1);
  Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
    AlarmActions: [
      {
        'Fn::GetAtt': ['alarmLambda131DB691', 'Arn'],
      },
      {
        'Fn::GetAtt': ['alarmLambda131DB691', 'Arn'],
      },
    ],
  });
});
