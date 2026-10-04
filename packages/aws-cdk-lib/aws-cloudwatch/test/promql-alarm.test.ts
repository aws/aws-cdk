import type { Construct } from 'constructs';
import { Match, Template } from '../../assertions';
import { Duration, Stack } from '../../core';
import type { IAlarm, IAlarmAction } from '../lib';
import { PromQLAlarm } from '../lib/promql-alarm';

describe('PromQLAlarm', () => {
  test('can create a basic PromQL alarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new PromQLAlarm(stack, 'Alarm', {
      alarmName: 'MyPromQLAlarm',
      alarmDescription: 'Test PromQL alarm',
      query: 'satellite_battery_level < 50',
      pendingPeriod: Duration.seconds(3600),
      recoveryPeriod: Duration.seconds(0),
      evaluationInterval: Duration.seconds(10),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      AlarmName: 'MyPromQLAlarm',
      AlarmDescription: 'Test PromQL alarm',
      EvaluationCriteria: {
        PromQLCriteria: {
          Query: 'satellite_battery_level < 50',
          PendingPeriod: 3600,
          RecoveryPeriod: 0,
        },
      },
      EvaluationInterval: 10,
    });
  });

  test('can create PromQL alarm with only required properties', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new PromQLAlarm(stack, 'Alarm', {
      query: 'up == 0',
      evaluationInterval: Duration.seconds(60),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      EvaluationCriteria: {
        PromQLCriteria: {
          Query: 'up == 0',
          PendingPeriod: Match.absent(),
          RecoveryPeriod: Match.absent(),
        },
      },
      EvaluationInterval: 60,
    });
  });

  test('can add actions to PromQL alarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const alarm = new PromQLAlarm(stack, 'Alarm', {
      query: 'cpu_usage > 90',
      evaluationInterval: Duration.seconds(30),
    });

    alarm.addAlarmAction(new TestAlarmAction('arn:aws:sns:us-east-1:123456789012:alarm-topic'));
    alarm.addInsufficientDataAction(new TestAlarmAction('arn:aws:sns:us-east-1:123456789012:insufficient-topic'));
    alarm.addOkAction(new TestAlarmAction('arn:aws:sns:us-east-1:123456789012:ok-topic'));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      AlarmActions: ['arn:aws:sns:us-east-1:123456789012:alarm-topic'],
      InsufficientDataActions: ['arn:aws:sns:us-east-1:123456789012:insufficient-topic'],
      OKActions: ['arn:aws:sns:us-east-1:123456789012:ok-topic'],
    });
  });

  test('alarm ARN and name are generated correctly', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: { region: 'us-east-1', account: '123456789012' },
    });

    // WHEN
    const alarm = new PromQLAlarm(stack, 'Alarm', {
      alarmName: 'TestPromQLAlarm',
      query: 'up == 0',
      evaluationInterval: Duration.seconds(10),
    });

    // THEN
    expect(alarm.alarmName).toBeDefined();
    expect(alarm.alarmArn).toBeDefined();
  });

  test('actionsEnabled defaults to undefined (true in CloudFormation)', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new PromQLAlarm(stack, 'Alarm', {
      query: 'up == 0',
      evaluationInterval: Duration.seconds(10),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      ActionsEnabled: Match.absent(),
    });
  });

  test('actionsEnabled can be set to false', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new PromQLAlarm(stack, 'Alarm', {
      query: 'up == 0',
      evaluationInterval: Duration.seconds(10),
      actionsEnabled: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      ActionsEnabled: false,
    });
  });

  test('can import PromQL alarm from ARN', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const alarm = PromQLAlarm.fromPromQLAlarmArn(stack, 'ImportedAlarm', 'arn:aws:cloudwatch:us-east-1:123456789012:alarm:MyPromQLAlarm');

    // THEN
    expect(alarm.alarmArn).toEqual('arn:aws:cloudwatch:us-east-1:123456789012:alarm:MyPromQLAlarm');
    expect(alarm.alarmName).toEqual('MyPromQLAlarm');
  });

  test('can import PromQL alarm from name', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const alarm = PromQLAlarm.fromPromQLAlarmName(stack, 'ImportedAlarm', 'MyPromQLAlarm');

    // THEN
    expect(alarm.alarmName).toEqual('MyPromQLAlarm');
    expect(alarm.alarmArn).toMatch(/:alarm:MyPromQLAlarm$/);
  });

  test('alarmDescription is absent when not provided', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new PromQLAlarm(stack, 'Alarm', {
      query: 'up == 0',
      evaluationInterval: Duration.seconds(10),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      AlarmDescription: Match.absent(),
    });
  });

  test('auto-generated alarmName is a non-empty string', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const alarm = new PromQLAlarm(stack, 'Alarm', {
      query: 'up == 0',
      evaluationInterval: Duration.seconds(10),
    });

    // THEN
    expect(typeof alarm.alarmName).toEqual('string');
    expect(alarm.alarmName.length).toBeGreaterThan(0);
  });

  test('renders alarm rule correctly', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: { region: 'us-east-1', account: '123456789012' },
    });

    // WHEN
    const alarm = new PromQLAlarm(stack, 'Alarm', {
      alarmName: 'TestPromQLAlarm',
      query: 'up == 0',
      evaluationInterval: Duration.seconds(10),
    });

    // THEN
    expect(alarm.renderAlarmRule()).toMatch(/ALARM\(".*"\)/);
  });

  test('throws when evaluationInterval is less than 10 seconds', () => {
    const stack = new Stack();
    expect(() => new PromQLAlarm(stack, 'Alarm', {
      query: 'up == 0',
      evaluationInterval: Duration.seconds(5),
    })).toThrow(/evaluationInterval must be between 10 and 3600 seconds, got 5/);
  });

  test('throws when evaluationInterval is greater than 3600 seconds', () => {
    const stack = new Stack();
    expect(() => new PromQLAlarm(stack, 'Alarm', {
      query: 'up == 0',
      evaluationInterval: Duration.seconds(7200),
    })).toThrow(/evaluationInterval must be between 10 and 3600 seconds, got 7200/);
  });

  test('throws when pendingPeriod is greater than 86400 seconds', () => {
    const stack = new Stack();
    expect(() => new PromQLAlarm(stack, 'Alarm', {
      query: 'up == 0',
      evaluationInterval: Duration.seconds(60),
      pendingPeriod: Duration.seconds(86401),
    })).toThrow(/pendingPeriod must be between 0 and 86400 seconds, got 86401/);
  });

  test('throws when recoveryPeriod is greater than 86400 seconds', () => {
    const stack = new Stack();
    expect(() => new PromQLAlarm(stack, 'Alarm', {
      query: 'up == 0',
      evaluationInterval: Duration.seconds(60),
      recoveryPeriod: Duration.seconds(86401),
    })).toThrow(/recoveryPeriod must be between 0 and 86400 seconds, got 86401/);
  });

  test('throws when query is empty', () => {
    const stack = new Stack();
    expect(() => new PromQLAlarm(stack, 'Alarm', {
      query: '',
      evaluationInterval: Duration.seconds(60),
    })).toThrow(/query must be between 1 and 10000 characters, got 0/);
  });

  test('throws when query exceeds 10000 characters', () => {
    const stack = new Stack();
    expect(() => new PromQLAlarm(stack, 'Alarm', {
      query: 'x'.repeat(10001),
      evaluationInterval: Duration.seconds(60),
    })).toThrow(/query must be between 1 and 10000 characters, got 10001/);
  });
});

class TestAlarmAction implements IAlarmAction {
  constructor(private readonly arn: string) {}
  public bind(_scope: Construct, _alarm: IAlarm) {
    return { alarmActionArn: this.arn };
  }
}
