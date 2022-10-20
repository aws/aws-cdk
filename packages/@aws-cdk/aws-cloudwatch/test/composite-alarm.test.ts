import { Template } from '@aws-cdk/assertions';
import { Duration, Stack } from '@aws-cdk/core';
import { Alarm, AlarmRule, AlarmState, CompositeAlarm, Metric } from '../lib';

describe('CompositeAlarm', () => {
  test('test alarm rule expression builder', () => {
    const stack = new Stack();

    const testMetric = new Metric({
      namespace: 'CDK/Test',
      metricName: 'Metric',
    });

    const alarm1 = new Alarm(stack, 'Alarm1', {
      metric: testMetric,
      threshold: 100,
      evaluationPeriods: 3,
    });

    const alarm2 = new Alarm(stack, 'Alarm2', {
      metric: testMetric,
      threshold: 1000,
      evaluationPeriods: 3,
    });

    const alarm3 = new Alarm(stack, 'Alarm3', {
      metric: testMetric,
      threshold: 10000,
      evaluationPeriods: 3,
    });

    const alarm4 = new Alarm(stack, 'Alarm4', {
      metric: testMetric,
      threshold: 100000,
      evaluationPeriods: 3,
    });

    const alarm5 = new Alarm(stack, 'Alarm5', {
      alarmName: 'Alarm with space in name',
      metric: testMetric,
      threshold: 100000,
      evaluationPeriods: 3,
    });

    const alarmRule = AlarmRule.anyOf(
      AlarmRule.allOf(
        AlarmRule.anyOf(
          alarm1,
          AlarmRule.fromAlarm(alarm2, AlarmState.OK),
          alarm3,
          alarm5,
        ),
        AlarmRule.not(AlarmRule.fromAlarm(alarm4, AlarmState.INSUFFICIENT_DATA)),
      ),
      AlarmRule.fromBoolean(false),
    );

    new CompositeAlarm(stack, 'CompositeAlarm', {
      alarmRule,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::CompositeAlarm', {
      AlarmName: 'CompositeAlarm',
      AlarmRule: {
        'Fn::Join': [
          '',
          [
            '(((ALARM("',
            {
              'Fn::GetAtt': [
                'Alarm1F9009D71',
                'Arn',
              ],
            },
            '") OR OK("',
            {
              'Fn::GetAtt': [
                'Alarm2A7122E13',
                'Arn',
              ],
            },
            '") OR ALARM("',
            {
              'Fn::GetAtt': [
                'Alarm32341D8D9',
                'Arn',
              ],
            },
            '") OR ALARM("',
            {
              'Fn::GetAtt': [
                'Alarm548383B2F',
                'Arn',
              ],
            },
            '")) AND (NOT (INSUFFICIENT_DATA("',
            {
              'Fn::GetAtt': [
                'Alarm4671832C8',
                'Arn',
              ],
            },
            '")))) OR FALSE)',
          ],
        ],
      },
    });


  });

  test('test action suppressor translates to a correct CFN properties', () => {
    const stack = new Stack();

    const testMetric = new Metric({
      namespace: 'CDK/Test',
      metricName: 'Metric',
    });

    const actionsSuppressor = new Alarm(stack, 'Alarm1', {
      metric: testMetric,
      threshold: 100,
      evaluationPeriods: 3,
    });


    const alarmRule = AlarmRule.fromBoolean(true);

    new CompositeAlarm(stack, 'CompositeAlarm', {
      alarmRule,
      actionsSuppressor,
      actionsSuppressorExtensionPeriod: Duration.minutes(2),
      actionsSuppressorWaitPeriod: Duration.minutes(5),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::CompositeAlarm', {
      AlarmName: 'CompositeAlarm',
      ActionsSuppressor: {
        'Fn::GetAtt': [
          'Alarm1F9009D71',
          'Arn',
        ],
      },
      ActionsSuppressorExtensionPeriod: 120,
      ActionsSuppressorWaitPeriod: 300,
    });
  });

  test('test wait and extension periods set without action suppressor', () => {
    const stack = new Stack();

    const alarmRule = AlarmRule.fromBoolean(true);

    var createAlarm = () => new CompositeAlarm(stack, 'CompositeAlarm', {
      alarmRule,
      actionsSuppressorExtensionPeriod: Duration.minutes(2),
      actionsSuppressorWaitPeriod: Duration.minutes(5),
    });

    expect(createAlarm).toThrow('ActionsSuppressor Extension/Wait Periods require an ActionsSuppressor to be set.');
  });

  test('test action suppressor has correct defaults set', () => {
    const stack = new Stack();

    const testMetric = new Metric({
      namespace: 'CDK/Test',
      metricName: 'Metric',
    });

    const actionsSuppressor = new Alarm(stack, 'Alarm1', {
      metric: testMetric,
      threshold: 100,
      evaluationPeriods: 3,
    });


    const alarmRule = AlarmRule.fromBoolean(true);

    new CompositeAlarm(stack, 'CompositeAlarm', {
      alarmRule,
      actionsSuppressor,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::CompositeAlarm', {
      AlarmName: 'CompositeAlarm',
      ActionsSuppressor: {
        'Fn::GetAtt': [
          'Alarm1F9009D71',
          'Arn',
        ],
      },
      ActionsSuppressorExtensionPeriod: 60,
      ActionsSuppressorWaitPeriod: 60,
    });
  });

});
