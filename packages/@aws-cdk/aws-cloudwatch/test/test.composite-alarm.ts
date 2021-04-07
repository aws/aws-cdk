import { expect, haveResource } from '@aws-cdk/assert-internal';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Alarm, AlarmRule, AlarmState, CompositeAlarm, Metric } from '../lib';

export = {
  'test alarm rule expression builder'(test: Test) {
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

    const alarmRule = AlarmRule.anyOf(
      AlarmRule.allOf(
        AlarmRule.anyOf(
          alarm1,
          AlarmRule.fromAlarm(alarm2, AlarmState.OK),
          alarm3,
        ),
        AlarmRule.not(AlarmRule.fromAlarm(alarm4, AlarmState.INSUFFICIENT_DATA)),
      ),
      AlarmRule.fromBoolean(false),
    );

    new CompositeAlarm(stack, 'CompositeAlarm', {
      alarmRule,
    });

    expect(stack).to(haveResource('AWS::CloudWatch::CompositeAlarm', {
      AlarmName: 'CompositeAlarm',
      AlarmRule: {
        'Fn::Join': [
          '',
          [
            '(((ALARM(',
            {
              'Fn::GetAtt': [
                'Alarm1F9009D71',
                'Arn',
              ],
            },
            ') OR OK(',
            {
              'Fn::GetAtt': [
                'Alarm2A7122E13',
                'Arn',
              ],
            },
            ') OR ALARM(',
            {
              'Fn::GetAtt': [
                'Alarm32341D8D9',
                'Arn',
              ],
            },
            ')) AND (NOT (INSUFFICIENT_DATA(',
            {
              'Fn::GetAtt': [
                'Alarm4671832C8',
                'Arn',
              ],
            },
            ')))) OR FALSE)',
          ],
        ],
      },
    }));

    test.done();
  },

};
