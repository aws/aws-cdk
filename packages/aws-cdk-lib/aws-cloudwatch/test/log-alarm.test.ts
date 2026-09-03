import { Annotations, Match, Template } from '../../assertions';
import { PolicyStatement, Role, ServicePrincipal } from '../../aws-iam';
import { LogGroup } from '../../aws-logs';
import { Duration, Stack, Token } from '../../core';
import type { IAlarmAction } from '../lib';
import { ComparisonOperator, LogAlarm, TreatMissingData } from '../lib';

describe('LogAlarm', () => {
  let stack: Stack;
  let queryRole: Role;
  let logGroup: LogGroup;

  beforeEach(() => {
    stack = new Stack();
    queryRole = new Role(stack, 'QueryRole', {
      assumedBy: new ServicePrincipal('cloudwatch.amazonaws.com'),
    });
    logGroup = new LogGroup(stack, 'LogGroup');
  });

  function baseProps() {
    return {
      threshold: 5,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      queryResultsToEvaluate: 3,
      queryResultsToAlarm: 2,
      scheduledQueryConfiguration: {
        queryString: 'fields @message | filter @message like /ERROR/',
        aggregationExpression: 'count(*)',
        logGroups: [logGroup],
        scheduledQueryRole: queryRole,
        schedule: { rate: Duration.minutes(5), startTimeOffset: Duration.minutes(5) },
      },
    };
  }

  test('creates an AWS::CloudWatch::LogAlarm with the expected properties', () => {
    new LogAlarm(stack, 'Alarm', baseProps());

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::LogAlarm', {
      ComparisonOperator: 'GreaterThanThreshold',
      Threshold: 5,
      QueryResultsToEvaluate: 3,
      QueryResultsToAlarm: 2,
      ScheduledQueryConfiguration: {
        QueryString: 'fields @message | filter @message like /ERROR/',
        AggregationExpression: 'count(*)',
        LogGroupIdentifiers: [{ Ref: Match.stringLikeRegexp('^LogGroup') }],
        ScheduleConfiguration: { ScheduleExpression: 'rate(5 minutes)' },
      },
    });
  });

  test('singularises the schedule unit when rate is 1 minute', () => {
    new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      scheduledQueryConfiguration: {
        ...baseProps().scheduledQueryConfiguration,
        schedule: { rate: Duration.minutes(1), startTimeOffset: Duration.minutes(5) },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::LogAlarm', {
      ScheduledQueryConfiguration: { ScheduleConfiguration: { ScheduleExpression: 'rate(1 minute)' } },
    });
  });

  test('renders whole-hour rates as hours', () => {
    new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      scheduledQueryConfiguration: {
        ...baseProps().scheduledQueryConfiguration,
        schedule: { rate: Duration.hours(1), startTimeOffset: Duration.minutes(5) },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::LogAlarm', {
      ScheduledQueryConfiguration: { ScheduleConfiguration: { ScheduleExpression: 'rate(1 hour)' } },
    });
  });

  test('supports treatMissingData and actionsEnabled', () => {
    new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      treatMissingData: TreatMissingData.NOT_BREACHING,
      actionsEnabled: false,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::LogAlarm', {
      TreatMissingData: 'notBreaching',
      ActionsEnabled: false,
    });
  });

  test('renders the scheduled query role arn and offsets', () => {
    new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      scheduledQueryConfiguration: {
        ...baseProps().scheduledQueryConfiguration,
        schedule: {
          rate: Duration.minutes(5),
          startTimeOffset: Duration.minutes(5),
          endTimeOffset: Duration.seconds(0),
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::LogAlarm', {
      ScheduledQueryConfiguration: {
        ScheduleConfiguration: {
          ScheduleExpression: 'rate(5 minutes)',
          StartTimeOffset: 300,
          EndTimeOffset: 0,
        },
      },
    });
  });

  test('applies tags to the alarm', () => {
    new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      tags: { team: 'observability', env: 'prod' },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::LogAlarm', {
      Tags: [
        { Key: 'env', Value: 'prod' },
        { Key: 'team', Value: 'observability' },
      ],
    });
  });

  test('warns when an unsupported action type is added', () => {
    const alarm = new LogAlarm(stack, 'Alarm', baseProps());
    const aiopsAction: IAlarmAction = {
      bind: () => ({ alarmActionArn: 'arn:aws:aiops:us-east-1:123456789012:investigation-group/my-group' }),
    };

    alarm.addAlarmAction(aiopsAction);

    Annotations.fromStack(stack).hasWarning('/Default/Alarm',
      Match.stringLikeRegexp('log alarms do not support aiops actions'));
  });

  test('does not warn for a supported (SNS) action', () => {
    const alarm = new LogAlarm(stack, 'Alarm', baseProps());
    const snsAction: IAlarmAction = {
      bind: () => ({ alarmActionArn: 'arn:aws:sns:us-east-1:123456789012:my-topic' }),
    };

    alarm.addAlarmAction(snsAction);

    Annotations.fromStack(stack).hasNoWarning('/Default/Alarm',
      Match.stringLikeRegexp('do not support'));
  });

  test('omits logGroups when not provided (inline SOURCE query)', () => {
    const { logGroups, ...sqcWithout } = baseProps().scheduledQueryConfiguration;
    void logGroups;
    new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      scheduledQueryConfiguration: sqcWithout,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::LogAlarm', {
      ScheduledQueryConfiguration: Match.objectLike({
        QueryString: 'fields @message | filter @message like /ERROR/',
        AggregationExpression: 'count(*)',
        LogGroupIdentifiers: Match.absent(),
      }),
    });
  });

  test('grants query permissions to a caller-supplied role, scoped to the log groups', () => {
    new LogAlarm(stack, 'Alarm', baseProps());

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: ['logs:StartQuery', 'logs:StopQuery', 'logs:GetQueryResults'],
            Resource: { 'Fn::GetAtt': [Match.stringLikeRegexp('^LogGroup'), 'Arn'] },
          }),
        ]),
      }),
      Roles: [{ Ref: Match.stringLikeRegexp('^QueryRole') }],
    });
  });

  test('falls back to a region-wide log group scope when no log groups are given', () => {
    const props = baseProps();
    const { logGroups, ...sqcWithout } = props.scheduledQueryConfiguration;
    void logGroups;
    new LogAlarm(stack, 'Alarm', { ...props, scheduledQueryConfiguration: sqcWithout });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: ['logs:StartQuery', 'logs:StopQuery', 'logs:GetQueryResults'],
            Resource: { 'Fn::Join': ['', Match.arrayWith([Match.stringLikeRegexp('log-group:\\*')])] },
          }),
        ]),
      }),
    });
  });

  test('addToRolePolicy adds a statement to the scheduled query role', () => {
    const alarm = new LogAlarm(stack, 'Alarm', baseProps());

    alarm.addToRolePolicy(new PolicyStatement({
      actions: ['logs:GetLogRecord'],
      resources: ['*'],
    }));

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({ Action: 'logs:GetLogRecord', Resource: '*' }),
        ]),
      }),
      Roles: [{ Ref: Match.stringLikeRegexp('^QueryRole') }],
    });
  });

  test('applies tags to the scheduled query, independently of the alarm tags', () => {
    const props = baseProps();
    new LogAlarm(stack, 'Alarm', {
      ...props,
      tags: { owner: 'team-a' },
      scheduledQueryConfiguration: {
        ...props.scheduledQueryConfiguration,
        tags: { costCenter: '1234' },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::LogAlarm', {
      Tags: [{ Key: 'owner', Value: 'team-a' }],
      ScheduledQueryConfiguration: Match.objectLike({
        Tags: [{ Key: 'costCenter', Value: '1234' }],
      }),
    });
  });

  test('omits scheduled query tags when not provided', () => {
    new LogAlarm(stack, 'Alarm', baseProps());

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::LogAlarm', {
      ScheduledQueryConfiguration: Match.objectLike({ Tags: Match.absent() }),
    });
  });

  test.each([
    ['tags', 51],
    ['scheduledQueryConfiguration.tags', 51],
  ])('fails when %s exceeds 50 entries', (propName, count) => {
    const tooMany = Object.fromEntries(Array.from({ length: count }, (_, i) => [`k${i}`, 'v']));
    const props = baseProps();
    expect(() => new LogAlarm(stack, 'Alarm', propName === 'tags'
      ? { ...props, tags: tooMany }
      : { ...props, scheduledQueryConfiguration: { ...props.scheduledQueryConfiguration, tags: tooMany } },
    )).toThrow(new RegExp(`${propName.replace('.', '\\.')} can contain at most 50 tags`));
  });

  test.each([0, 256])('fails for a logAlarmName of invalid length %d', (length) => {
    expect(() => new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      logAlarmName: 'a'.repeat(length),
    })).toThrow(/logAlarmName must be between 1 and 255 characters/);
  });

  test('renders logAlarmName as the alarm name', () => {
    new LogAlarm(stack, 'Alarm', { ...baseProps(), logAlarmName: 'my-log-alarm' });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::LogAlarm', {
      AlarmName: 'my-log-alarm',
    });
  });

  test('fails for an empty logGroups array', () => {
    const props = baseProps();
    expect(() => new LogAlarm(stack, 'Alarm', {
      ...props,
      scheduledQueryConfiguration: { ...props.scheduledQueryConfiguration, logGroups: [] },
    })).toThrow(/logGroups must contain between 1 and 50 entries, got 0/);
  });

  test('fails when actionLogLineRole is given without actionLogLineCount', () => {
    expect(() => new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      actionLogLineRole: queryRole,
    })).toThrow(/actionLogLineRole is only used when actionLogLineCount is greater than 0/);
  });

  test('fails when actionLogLineRole is given with actionLogLineCount of 0', () => {
    expect(() => new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      actionLogLineCount: 0,
      actionLogLineRole: queryRole,
    })).toThrow(/actionLogLineRole is only used when actionLogLineCount is greater than 0/);
  });

  test('accepts a tokenized schedule rate, rendering minutes', () => {
    const props = baseProps();
    new LogAlarm(stack, 'Alarm', {
      ...props,
      scheduledQueryConfiguration: {
        ...props.scheduledQueryConfiguration,
        schedule: {
          rate: Duration.minutes(Token.asNumber({ Ref: 'RateParam' })),
          startTimeOffset: Duration.minutes(5),
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::LogAlarm', {
      ScheduledQueryConfiguration: Match.objectLike({
        ScheduleConfiguration: Match.objectLike({
          ScheduleExpression: { 'Fn::Join': ['', ['rate(', { Ref: 'RateParam' }, ' minutes)']] },
        }),
      }),
    });
  });

  test('fails when queryResultsToAlarm exceeds queryResultsToEvaluate', () => {
    expect(() => new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      queryResultsToEvaluate: 2,
      queryResultsToAlarm: 3,
    })).toThrow(/queryResultsToAlarm must not exceed queryResultsToEvaluate/);
  });

  test('fails when queryResultsToEvaluate exceeds 100', () => {
    expect(() => new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      queryResultsToEvaluate: 101,
      queryResultsToAlarm: 1,
    })).toThrow(/queryResultsToEvaluate must be an integer between 1 and 100/);
  });

  test('fails when queryString exceeds 10000 characters', () => {
    const props = baseProps();
    expect(() => new LogAlarm(stack, 'Alarm', {
      ...props,
      scheduledQueryConfiguration: {
        ...props.scheduledQueryConfiguration,
        queryString: 'a'.repeat(10001),
      },
    })).toThrow(/queryString must be between 1 and 10000 characters/);
  });

  test('accepts token-based schedule offsets without validating', () => {
    const props = baseProps();
    new LogAlarm(stack, 'Alarm', {
      ...props,
      scheduledQueryConfiguration: {
        ...props.scheduledQueryConfiguration,
        schedule: {
          ...props.scheduledQueryConfiguration.schedule,
          startTimeOffset: Duration.seconds(Token.asNumber({ Ref: 'StartOffsetParam' })),
          endTimeOffset: Duration.seconds(Token.asNumber({ Ref: 'EndOffsetParam' })),
        },
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::LogAlarm', 1);
  });

  test('fails for an anomaly-detection comparison operator', () => {
    expect(() => new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
    })).toThrow(/not supported by log alarms/);
  });

  test('auto-creates a log line role when actionLogLineCount > 0 and no role is given', () => {
    new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      actionLogLineCount: 10,
    });

    const template = Template.fromStack(stack);
    // trusts cloudwatch.amazonaws.com with confused-deputy conditions scoped to the alarm ARN
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [Match.objectLike({
          Action: 'sts:AssumeRole',
          Principal: { Service: 'cloudwatch.amazonaws.com' },
          Condition: {
            StringEquals: { 'aws:SourceAccount': Match.anyValue() },
            ArnLike: { 'aws:SourceArn': Match.objectLike({ 'Fn::Join': Match.arrayWith([Match.arrayWith([Match.stringLikeRegexp(':cloudwatch:')])]) }) },
          },
        })],
      },
    });
    template.hasResourceProperties('AWS::CloudWatch::LogAlarm', {
      ActionLogLineCount: 10,
      ActionLogLineRoleArn: Match.anyValue(),
    });
  });

  test('auto-creates a scheduled query role when none is provided', () => {
    const { scheduledQueryRole, ...sqcWithoutRole } = baseProps().scheduledQueryConfiguration;
    void scheduledQueryRole;
    new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      scheduledQueryConfiguration: sqcWithoutRole,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [Match.objectLike({
          Action: 'sts:AssumeRole',
          Principal: { Service: 'logs.amazonaws.com' },
          Condition: {
            StringEquals: { 'aws:SourceAccount': Match.anyValue() },
            ArnLike: { 'aws:SourceArn': Match.objectLike({ 'Fn::Join': Match.arrayWith([Match.arrayWith([Match.stringLikeRegexp(':logs:')])]) }) },
          },
        })],
      },
    });
  });

  test('fails when actionLogLineCount exceeds 50', () => {
    expect(() => new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      actionLogLineCount: 51,
      actionLogLineRole: queryRole,
    })).toThrow(/actionLogLineCount must be an integer between 0 and 50/);
  });

  test('fails when startTimeOffset exceeds 30 days', () => {
    expect(() => new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      scheduledQueryConfiguration: {
        ...baseProps().scheduledQueryConfiguration,
        schedule: { rate: Duration.minutes(5), startTimeOffset: Duration.days(31) },
      },
    })).toThrow(/startTimeOffset must be between 1 second and 2592000 seconds/);
  });

  test('fails when endTimeOffset exceeds 30 days', () => {
    expect(() => new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      scheduledQueryConfiguration: {
        ...baseProps().scheduledQueryConfiguration,
        schedule: {
          rate: Duration.minutes(5),
          startTimeOffset: Duration.minutes(5),
          endTimeOffset: Duration.days(31),
        },
      },
    })).toThrow(/endTimeOffset must be between 0 seconds and 2592000 seconds/);
  });

  test('fails when aggregationExpression exceeds 2048 characters', () => {
    expect(() => new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      scheduledQueryConfiguration: {
        ...baseProps().scheduledQueryConfiguration,
        aggregationExpression: 'x'.repeat(2049),
      },
    })).toThrow(/aggregationExpression can be at most 2048 characters/);
  });

  test('fails for a non-integer queryResultsToAlarm', () => {
    expect(() => new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      queryResultsToAlarm: 1.5,
    })).toThrow(/queryResultsToAlarm must be a positive integer/);
  });

  test('fails for a sub-minute schedule rate', () => {
    expect(() => new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      scheduledQueryConfiguration: {
        ...baseProps().scheduledQueryConfiguration,
        schedule: { rate: Duration.seconds(30), startTimeOffset: Duration.minutes(5) },
      },
    })).toThrow(/schedule rate must be a whole number of minutes/);
  });

  test('fails for a non-whole-minute schedule rate', () => {
    expect(() => new LogAlarm(stack, 'Alarm', {
      ...baseProps(),
      scheduledQueryConfiguration: {
        ...baseProps().scheduledQueryConfiguration,
        schedule: { rate: Duration.seconds(90), startTimeOffset: Duration.minutes(5) },
      },
    })).toThrow(/schedule rate must be a whole number of minutes/);
  });
});
